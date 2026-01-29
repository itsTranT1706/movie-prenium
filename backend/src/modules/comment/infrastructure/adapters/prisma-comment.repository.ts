import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

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
    return {
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
      replies: comment.replies
        ? comment.replies.map((reply: any) => this.mapToComment(reply))
        : undefined,
    };
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
