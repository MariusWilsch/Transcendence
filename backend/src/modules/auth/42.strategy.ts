import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { authDto } from './auth.tdo';
import { ConfigService } from '@nestjs/config';
import { URL } from './constants';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private configService: ConfigService) {
		const clientIDD = configService.get('CLIENT_ID');
		const clientSecrett = configService.get('SECRET');
		try {
			if (!clientIDD || !clientSecrett) {
				throw new Error(
					'Client ID or client secret is missing in the configuration.'
				);
			}
		} catch (e) {
			// console.log("Error: ", e);
		}

		super({
			clientID: clientIDD,
			clientSecret: clientSecrett,
			callbackURL:
				configService.get('REDIRECT_URI') || `${URL}:3001/auth/42/callback`,
			profileFields: {
				username: 'login',
				usual_full_name: 'usual_full_name',
				email: 'email',
				intraId: 'id',
				avatar: 'image.link',
			},
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: Function
	): Promise<any> {
		try {
			const { username, usual_full_name, email, intraId, avatar } = profile;
			const user: authDto = {
				username: username,
				usual_full_name: usual_full_name,
				email: email,
				UId: intraId.toString(),
				Avatar: avatar,
			};

			done(null, user);
		} catch (e) {
			// console.log("Error: " ,e);
			done(e, false);
		}
	}
}
