import { IsString, IsEmail } from 'class-validator';

export class UserCreationDto {
  @IsString()
  Name: string;

  @IsString()
  Password: string;

  @IsEmail()
  Email: string;
}
