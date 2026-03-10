import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerItemDto {
  @IsString()
  question_id: string;

  @IsString()
  answer: string;
}

export class SubmitAnswersDto {
  @IsString()
  user_id: string;

  @IsString()
  assessment_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}
