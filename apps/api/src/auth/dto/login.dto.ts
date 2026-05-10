import { IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsString()
  email: string;  // accepts email or username

  @IsString()
  @MinLength(8)
  password: string;
}
