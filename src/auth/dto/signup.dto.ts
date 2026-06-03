import { IsEmail, IsString, MinLength } from 'class-validator';

export class signupDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}