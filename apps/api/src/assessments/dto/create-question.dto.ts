export class CreateQuestionDto {
  assessment_id: string;
  question_text: string;
  options_json: { label: string; value: string }[];
  correct_answer: string;
  points: number;
}
