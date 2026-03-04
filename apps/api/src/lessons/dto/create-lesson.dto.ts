export class CreateLessonDto {
  course_id: string;
  title: string;
  type: string;
  order_index: number;
  content_url?: string;
  content_text?: string;
}
