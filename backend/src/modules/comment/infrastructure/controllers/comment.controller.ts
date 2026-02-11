import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';
import {
  CreateCommentUseCase,
  CreateReplyUseCase,
  GetMovieCommentsUseCase,
  GetRecentCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  VoteCommentUseCase,
  GetCommentCountUseCase,
} from '../../application/use-cases';
import {
  CreateCommentDto,
  CreateReplyDto,
  UpdateCommentDto,
  VoteCommentDto,
} from '../../application/dto';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly createReplyUseCase: CreateReplyUseCase,
    private readonly getMovieCommentsUseCase: GetMovieCommentsUseCase,
    private readonly getRecentCommentsUseCase: GetRecentCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly voteCommentUseCase: VoteCommentUseCase,
    private readonly getCommentCountUseCase: GetCommentCountUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Req() req: any, @Body() dto: CreateCommentDto) {
    // console.log('Creating comment:', {
    //   userId: req.user.userId,
    //   movieId: dto.movieId,
    //   contentLength: dto.content.length,
    // });

    try {
      const comment = await this.createCommentUseCase.execute({
        userId: req.user.userId,
        movieId: dto.movieId,
        content: dto.content,
        isSpoiler: dto.isSpoiler,
      });

      return {
        success: true,
        data: comment,
        message: 'Comment created successfully',
      };
    } catch (error: any) {
      console.error('Error creating comment:', error.message);
      throw error;
    }
  }

  @Post(':id/replies')
  @UseGuards(JwtAuthGuard)
  async createReply(
    @Req() req: any,
    @Param('id') parentId: string,
    @Body() dto: CreateReplyDto,
  ) {
    const reply = await this.createReplyUseCase.execute({
      userId: req.user.userId,
      parentId,
      content: dto.content,
      isSpoiler: dto.isSpoiler,
    });

    return {
      success: true,
      data: reply,
      message: 'Reply created successfully',
    };
  }

  @Get('movie/:movieId')
  async getMovieComments(@Param('movieId') movieId: string) {
    try {
      const comments = await this.getMovieCommentsUseCase.execute(movieId);

      return {
        success: true,
        data: comments,
      };
    } catch (error: any) {
      console.error('Error fetching movie comments:', error.message);
      
      // Return empty array if database is not reachable
      if (error.code === 'P1001' || error.message?.includes('DatabaseNotReachable')) {
        return {
          success: true,
          data: [],
          warning: 'Database temporarily unavailable',
        };
      }
      
      throw error;
    }
  }

  @Get('recent')
  async getRecentComments(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const comments = await this.getRecentCommentsUseCase.execute(limitNum);
      return {
        success: true,
        data: comments,
      };
    } catch (error: any) {
      console.error('❌ [CommentController] Error fetching recent comments:', error.message);
      
      // Return empty array if database is not reachable
      if (error.code === 'P1001' || error.message?.includes('DatabaseNotReachable')) {
        return {
          success: true,
          data: [],
          warning: 'Database temporarily unavailable',
        };
      }
      
      throw error;
    }
  }

  @Get('movie/:movieId/count')
  async getCommentCount(@Param('movieId') movieId: string) {
    try {
      const count = await this.getCommentCountUseCase.execute(movieId);

      return {
        success: true,
        data: { count },
      };
    } catch (error: any) {
      console.error('Error fetching comment count:', error.message);
      
      // Return 0 if database is not reachable
      if (error.code === 'P1001' || error.message?.includes('DatabaseNotReachable')) {
        return {
          success: true,
          data: { count: 0 },
          warning: 'Database temporarily unavailable',
        };
      }
      
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Req() req: any,
    @Param('id') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.updateCommentUseCase.execute({
      commentId,
      userId: req.user.userId,
      content: dto.content,
      isSpoiler: dto.isSpoiler,
    });

    return {
      success: true,
      data: comment,
      message: 'Comment updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteComment(@Req() req: any, @Param('id') commentId: string) {
    await this.deleteCommentUseCase.execute({
      commentId,
      userId: req.user.userId,
    });

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  async voteComment(
    @Req() req: any,
    @Param('id') commentId: string,
    @Body() dto: VoteCommentDto,
  ) {
    const comment = await this.voteCommentUseCase.execute({
      commentId,
      userId: req.user.userId,
      voteType: dto.voteType,
    });

    return {
      success: true,
      data: comment,
      message: 'Vote recorded successfully',
    };
  }
}
