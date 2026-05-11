import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  lesson_id: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  max_score?: number;

  @IsNumber()
  @IsOptional()
  pass_score?: number;
}
