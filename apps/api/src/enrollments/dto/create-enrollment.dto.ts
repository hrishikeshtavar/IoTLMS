import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  course_id: string;

  // Set by controller from JWT — never trust body for these
  user_id: string;
  tenant_id: string;
}
