import { Module } from '@nestjs/common';
import { COMMENT_REPOSITORY, SPAM_DETECTOR } from '../domain/ports';
import {
  CreateCommentUseCase,
  CreateReplyUseCase,
  GetMovieCommentsUseCase,
  GetRecentCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  VoteCommentUseCase,
  GetCommentCountUseCase,
} from '../application/use-cases';
import { PrismaCommentRepository } from './adapters/prisma-comment.repository';
import { RateLimitSpamDetector } from './adapters/rate-limit-spam-detector';
import { CommentController } from './controllers/comment.controller';

@Module({
  controllers: [CommentController],
  providers: [
    // Use cases
    CreateCommentUseCase,
    CreateReplyUseCase,
    GetMovieCommentsUseCase,
    GetRecentCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    VoteCommentUseCase,
    GetCommentCountUseCase,
    // Repository
    {
      provide: COMMENT_REPOSITORY,
      useClass: PrismaCommentRepository,
    },
    // Spam detector
    {
      provide: SPAM_DETECTOR,
      useClass: RateLimitSpamDetector,
    },
  ],
  exports: [COMMENT_REPOSITORY],
})
export class CommentModule {}
