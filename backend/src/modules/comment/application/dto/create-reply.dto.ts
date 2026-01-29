import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MaxLength(1000, { message: 'Content cannot exceed 1000 characters' })
  content: string;

  @IsBoolean()
  @IsOptional()
  isSpoiler?: boolean;
}
