import { Injectable, Req } from '@nestjs/common';
import { authDto, signeinDto } from './auth.tdo';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { Email2FAService } from './nodemailer/email.service';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'modules/user/user.service';
// import { User } from '@prisma/client';

type User = {
	intraId: string;
	fullname: string;
	login: string;
	email: string;
	Avatar: string;
	isRegistred: boolean;
	isTfaEnabled: boolean;
	status: string;
	created_at: Date;
	updated_at: Date;
};

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
	constructor(
		private Email2FAService: Email2FAService,
		private jwtService: JwtService,
		private userService: UserService
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
			status: 'ONLINE',
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

			// // console.log('payload: ', payload);
			return user;
		} catch (error) {
			console.error('JWT Verification Error:', error);
			return undefined;
		}
	}

	async getUserFromJwt(jwt: any): Promise<any | undefined> {
		if (!jwt) {
			return undefined;
		}

		try {
			const payload = this.jwtService.verify(jwt, {
				secret: JWT_SECRET,
			});

			const user = payload.userWithoutDate;
			const userIntraId = user.intraId;
			const user1 = await this.userService.getUserbyId(userIntraId);

			return user1;
		} catch (error) {
			console.error('JWT Verification Error:', error);
			return undefined;
		}
	}

	getUserFromJwtstatic(jwt: any): User | undefined {
		if (!jwt) {
			return undefined;
		}

		try {
			const payload = this.jwtService.verify(jwt, {
				secret: JWT_SECRET,
			});

			const user = payload.userWithoutDate;
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
		const userIntraId = user.intraId;
		const existingTfa = await prisma.tfa.findUnique({
			where: { intraId: userIntraId },
		});

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

	async create(user: signeinDto) {
		const pass = await this.hashCode(user.password);

		const userexit = await prisma.user.findFirst({
			where: {
				OR: [
					{
						login: user.username,
					},
					{
						email: user.email,
					},
					{
						fullname: user.usual_full_name,
					},
				],
			},
		});
		if (userexit) {
			return undefined;
		}

		const newUser = await prisma.user.create({
			data: {
				intraId: `${Date.now()}`,
				fullname: user.usual_full_name,
				login: user.username,
				email: user.email,
				Avatar:
					'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg',
				isRegistred: false,
				isTfaEnabled: false,
				status: 'ONLINE',
				password: pass,
			},
		});
		return newUser;
	}

	async findsignup(body: {
		username: string;
		password: string;
	}): Promise<User | undefined | string> {
		const userexit = await prisma.user.findUnique({
			where: {
				login: body.username,
			},
		});
		if (userexit) {
			const isMatch = await bcrypt.compare(body.password, userexit.password);
			if (isMatch) {
				if (userexit.isTfaEnabled === false) {
					return userexit;
				} else {
					this.generateOtp(userexit);
					return '2FA';
				}
			} else {
				return 'wrong password';
			}
		} else {
			return undefined;
		}
	}
}
