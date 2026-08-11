import { IsString, IsObject, IsIn, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

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

  /** Version the client last read. When present, a mismatch is rejected with 409 instead of overwriting. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  base_version?: number;

  /** Explicit opt-in to store an empty chapter (only sent by a human-triggered save). */
  @IsOptional()
  @IsBoolean()
  allow_empty?: boolean;
}
