import { Injectable, Inject } from '@nestjs/common';
import {
  ISpamDetector,
  SpamCheckResult,
} from '../../domain/ports/spam-detector.port';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';

@Injectable()
export class RateLimitSpamDetector implements ISpamDetector {
  private readonly RATE_LIMIT_COUNT = 5; // Max comments
  private readonly RATE_LIMIT_WINDOW = 1; // Minutes
  private readonly DUPLICATE_CHECK_WINDOW = 5; // Minutes

  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async checkRateLimit(userId: string): Promise<SpamCheckResult> {
    const count = await this.commentRepository.countUserCommentsInTimeWindow(
      userId,
      this.RATE_LIMIT_WINDOW,
    );

    if (count >= this.RATE_LIMIT_COUNT) {
      // Calculate wait time (in seconds)
      const waitTime = this.RATE_LIMIT_WINDOW * 60;

      return {
        allowed: false,
        waitTime,
      };
    }

    return {
      allowed: true,
    };
  }

  async checkDuplicate(userId: string, content: string): Promise<boolean> {
    const duplicate = await this.commentRepository.findDuplicateComment(
      userId,
      content,
      this.DUPLICATE_CHECK_WINDOW,
    );

    return duplicate !== null;
  }
}
