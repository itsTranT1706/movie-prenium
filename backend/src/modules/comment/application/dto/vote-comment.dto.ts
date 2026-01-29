import { IsEnum, IsNotEmpty } from 'class-validator';
import { VoteType } from '../../domain/entities';

export class VoteCommentDto {
  @IsEnum(['UPVOTE', 'DOWNVOTE'], {
    message: 'Vote type must be either UPVOTE or DOWNVOTE',
  })
  @IsNotEmpty()
  voteType: VoteType;
}
