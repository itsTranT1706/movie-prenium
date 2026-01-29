import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MaxLength(1000, { message: 'Content cannot exceed 1000 characters' })
  @ValidateIf((o) => o.content !== undefined)
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isSpoiler?: boolean;
}
