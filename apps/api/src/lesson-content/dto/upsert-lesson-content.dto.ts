import { IsString, IsObject, IsIn, IsOptional } from 'class-validator';

export class UpsertLessonContentDto {
  @IsString()
  lesson_id: string;

  @IsIn(['en', 'hi', 'mr'])
  locale: string;

  @IsObject()
  content_json: Record<string, unknown>;

  @IsOptional()
  @IsString()
  note?: string;
}
