import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ICommentRepository } from '../../domain/ports/comment.repository.port';
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentVote,
  CreateVoteData,
} from '../../domain/entities';

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
  private readonly tmdbApiKey: string;
  private readonly tmdbBaseUrl: string;
  private readonly tmdbImageBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.tmdbApiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    this.tmdbBaseUrl = this.configService.get<string>('TMDB_BASE_URL') || 'https://api.themoviedb.org/3';
    this.tmdbImageBaseUrl = this.configService.get<string>('TMDB_IMAGE_BASE_URL') || 'https://image.tmdb.org/t/p/w500';
  }

  async create(data: CreateCommentData): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          userId: data.userId,
          movieId: data.movieId,
          parentId: data.parentId ?? null,
          content: data.content,
          isSpoiler: data.isSpoiler ?? false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return this.mapToComment(comment);
    } catch (error: any) {
      // Handle foreign key constraint violation for userId
      if (error.code === 'P2003' && error.meta?.constraint === 'comments_userId_fkey') {
        throw new Error('User not found. Please ensure you are logged in.');
      }
      // Re-throw other errors
      throw error;
    }
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!comment) return null;

    return this.mapToComment(comment);
  }

  async findByMovieId(movieId: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        movieId,
        parentId: null, // Only parent comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc', // Replies ordered oldest first
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Parents ordered newest first
      },
    });

    return comments.map((comment) => this.mapToComment(comment));
  }

  async findRecent(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      // Remove parentId filter to include both parent comments and replies
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Fetch movie details for each comment
    const commentsWithMovies = await Promise.all(
      comments.map(async (comment) => {
        let movie = await this.prisma.movie.findUnique({
          where: { id: comment.movieId },
          select: {
            id: true,
            title: true,
            posterUrl: true,
          },
        });

        // If movie not found in DB, fetch from TMDB
        if (!movie) {
          console.log('⚠️ Movie not found in DB, fetching from TMDB:', comment.movieId);
          const tmdbMovie = await this.fetchMovieFromTMDB(comment.movieId);
          if (tmdbMovie) {
            movie = tmdbMovie;
            console.log('✅ Fetched from TMDB:', tmdbMovie.title);
          } else {
            // Fallback to placeholder
            movie = {
              id: comment.movieId,
              title: 'Unknown Movie',
              posterUrl: null,
            };
          }
        }

        console.log('🎬 Movie data for comment:', { commentId: comment.id, movie });

        return {
          ...comment,
          movie,
        };
      }),
    );

    console.log('✅ Comments with movies:', commentsWithMovies.length);
    return commentsWithMovies.map((comment) => this.mapToComment(comment));
  }

  // Helper to fetch movie from TMDB API
  private async fetchMovieFromTMDB(movieId: string): Promise<{ id: string; title: string; posterUrl: string | null } | null> {
    if (!this.tmdbApiKey) {
      console.warn('⚠️ TMDB API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.tmdbBaseUrl}/movie/${movieId}?api_key=${this.tmdbApiKey}&language=vi-VN`
      );

      if (!response.ok) {
        console.warn(`⚠️ TMDB API error for movie ${movieId}:`, response.status);
        return null;
      }

      const data = await response.json();
      return {
        id: movieId,
        title: data.title || data.original_title || 'Unknown Movie',
        posterUrl: data.poster_path ? `${this.tmdbImageBaseUrl}${data.poster_path}` : null,
      };
    } catch (error) {
      console.error('❌ Error fetching from TMDB:', error);
      return null;
    }
  }

  async update(id: string, data: UpdateCommentData): Promise<Comment> {
    const comment = await this.prisma.comment.update({
      where: { id },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.isSpoiler !== undefined && { isSpoiler: data.isSpoiler }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return this.mapToComment(comment);
  }

  async delete(id: string): Promise<void> {
    // Cascade deletion is handled by Prisma schema
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async countByMovieId(movieId: string): Promise<number> {
    // Count all comments (parents + replies)
    const count = await this.prisma.comment.count({
      where: { movieId },
    });

    return count;
  }

  // Vote operations
  async createVote(data: CreateVoteData): Promise<CommentVote> {
    const vote = await this.prisma.commentVote.create({
      data: {
        userId: data.userId,
        commentId: data.commentId,
        voteType: data.voteType,
      },
    });

    return this.mapToVote(vote);
  }

  async findVote(
    userId: string,
    commentId: string,
  ): Promise<CommentVote | null> {
    const vote = await this.prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (!vote) return null;

    return this.mapToVote(vote);
  }

  async deleteVote(id: string): Promise<void> {
    await this.prisma.commentVote.delete({
      where: { id },
    });
  }

  async updateVoteCounts(commentId: string): Promise<void> {
    // Count upvotes and downvotes
    const upvotes = await this.prisma.commentVote.count({
      where: {
        commentId,
        voteType: 'UPVOTE',
      },
    });

    const downvotes = await this.prisma.commentVote.count({
      where: {
        commentId,
        voteType: 'DOWNVOTE',
      },
    });

    // Update comment
    await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        upvotes,
        downvotes,
      },
    });
  }

  // Spam detection queries
  async countUserCommentsInTimeWindow(
    userId: string,
    minutes: number,
  ): Promise<number> {
    const timeWindow = new Date(Date.now() - minutes * 60 * 1000);

    const count = await this.prisma.comment.count({
      where: {
        userId,
        createdAt: {
          gte: timeWindow,
        },
      },
    });

    return count;
  }

  async findDuplicateComment(
    userId: string,
    content: string,
    minutes: number,
  ): Promise<Comment | null> {
    const timeWindow = new Date(Date.now() - minutes * 60 * 1000);

    const comment = await this.prisma.comment.findFirst({
      where: {
        userId,
        content,
        createdAt: {
          gte: timeWindow,
        },
      },
    });

    if (!comment) return null;

    return this.mapToComment(comment);
  }

  // Mapping helpers
  private mapToComment(comment: any): Comment {
    const mapped = {
      id: comment.id,
      userId: comment.userId,
      movieId: comment.movieId,
      parentId: comment.parentId,
      content: comment.content,
      isSpoiler: comment.isSpoiler,
      upvotes: comment.upvotes,
      downvotes: comment.downvotes,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user
        ? {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar,
        }
        : undefined,
      movie: comment.movie
        ? {
          id: comment.movie.id,
          title: comment.movie.title,
          posterUrl: comment.movie.posterUrl,
        }
        : undefined,
      parent: comment.parent ? this.mapToComment(comment.parent) : undefined,
      replies: comment.replies
        ? comment.replies.map((reply: any) => this.mapToComment(reply))
        : undefined,
    };

    // console.log('🗺️ Mapped comment:', { id: mapped.id, hasMovie: !!mapped.movie, movie: mapped.movie });
    return mapped;
  }

  private mapToVote(vote: any): CommentVote {
    return {
      id: vote.id,
      userId: vote.userId,
      commentId: vote.commentId,
      voteType: vote.voteType,
      createdAt: vote.createdAt,
    };
  }
}
