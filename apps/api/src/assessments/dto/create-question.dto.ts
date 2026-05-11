import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  assessment_id: string;

  @IsString()
  question_text: string;

  @IsArray()
  @IsOptional()
  options_json?: any[];

  @IsString()
  correct_answer: string;

  @IsNumber()
  @IsOptional()
  points?: number;
}
