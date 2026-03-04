export class SubmitAnswersDto {
  user_id: string;
  assessment_id: string;
  answers: { question_id: string; answer: string }[];
}
