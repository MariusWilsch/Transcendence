import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();



export const JWT_SECRET = configService.get('JWT_SECRET') || 'alternative_secret';
// export const JWT_SECRET = 'alternative_secret';