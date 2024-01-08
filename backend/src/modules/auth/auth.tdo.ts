import { Global } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@Global()
export class authDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  usual_full_name: string;

  @IsString()
  @IsNotEmpty()
  UId: string;

  @IsString()
  Avatar: string;
}

export class signeinDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  usual_full_name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
