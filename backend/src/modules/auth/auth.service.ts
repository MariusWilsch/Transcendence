import { Injectable, Req } from '@nestjs/common';
import { authDto } from './auth.tdo';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { Email2FAService } from './nodemailer/email.service';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { User } from '@prisma/client';

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  isRegistred: Boolean;
  isTfaEnabled: Boolean;
  created_at: Date;
  updated_at: Date;
};

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private Email2FAService: Email2FAService,
    private jwtService: JwtService
  ) {}

  getUser(user: authDto): User {
    const newUser = {
      intraId: user.UId,
      fullname: user.usual_full_name,
      login: user.username,
      email: user.email,
      Avatar: user.Avatar,
      isRegistred: false,
      isTfaEnabled: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return newUser;
  }

  // getAllusers(): User[] {
  //   return this.users;
  // }

  getUserFromCookie(req: any): User | undefined {
    const jwt = req.jwt;

    if (!jwt) {
      return undefined;
    }

    try {
      const payload = this.jwtService.verify(jwt, {
        secret: JWT_SECRET,
      });

      const user = payload.userWithoutDate;

      // console.log('payload: ', payload);
      return user;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return undefined;
    }
  }

  async generateOtp(user: any): Promise<any> {
    const otpLength = 6;
    let otp = '';

    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }

    const otpcode = otp;
    await this.Email2FAService.sendEmail(user.email, user.login, otp);

    const hash = await this.hashCode(otpcode);
    // save the otp in the db

    const userIntraId = user.intraId;

    // Find the existing Tfa entry for the user
    const existingTfa = await prisma.tfa.findUnique({
      where: { intraId: userIntraId },
    });

    // Update the existing Tfa entry or create a new one
    if (existingTfa) {
      await prisma.tfa.update({
        where: { intraId: existingTfa.intraId },
        data: { otp: hash },
      });
    } else {
      await prisma.tfa.create({
        data: {
          intraId: userIntraId,
          otp: hash,
        },
      });
    }

    // Send the secret to the user (usually via email)
    // ...

    // return { secret };
  }

  async verifyOtp(id: string, otp: string): Promise<boolean> {
    const existingTfa = await prisma.tfa.findUnique({
      where: { intraId: id },
    });

    const isCodeValid = await this.compareCode(otp, existingTfa.otp);
    if (existingTfa && isCodeValid) {
      await prisma.tfa.delete({
        where: { intraId: id },
      });

      await prisma.user.update({
        where: { intraId: id },
        data: { isRegistred: true },
      });
      return true;
    }
    return false;
  }

  async enableOtp(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { intraId: userId },
        data: { isTfaEnabled: true },
      });

      return true;
    } catch (error) {
      console.error('Error enabling otp:', error);
      return false;
    }
  }

  async disableOtp(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { intraId: userId },
        data: { isTfaEnabled: false },
      });

      return true;
    } catch (error) {
      console.error('Error disabling otp:', error);
      return false;
    }
  }
  async hashCode(code: string): Promise<string> {
    const saltRounds = 2;
    const hashedCode = await bcrypt.hash(code, saltRounds);
    return hashedCode;
  }

  async compareCode(code: string, hashedCode: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(code, hashedCode);
    return isMatch;
  }
}

// TODO:

// -authentication
// -authorization: jwt, passport, session, cookies
