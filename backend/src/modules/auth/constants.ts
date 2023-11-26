import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const JWT_SECRET = configService.get('JWT_SECRET') || 'alternative_secret';


// export const LOGIN_REDIRECT_URL = `${process.env.APP_URI}:5173/login`;
// export const PROFILE_REDIRECT_URL = `${process.env.APP_URI}:5173/profile`;
// export const SETTING_REDIRECT_URL = `${process.env.APP_URI}:5173/setting`;