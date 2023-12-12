import { Global } from '@nestjs/common';
// import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@Global()
// export class authDto {
//   email: string;
//   username: string;
//   usual_full_name: string;
//   UId: string;
//   Avatar: string;
// }

export class authDto {
  email: string;
  username: string;
  usual_full_name: string;
  UId: string;
  Avatar: string;
}
