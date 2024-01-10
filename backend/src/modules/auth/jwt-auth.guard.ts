import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JWT_SECRET } from './constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies.jwt;

    // console.log('cookie', cookie);
    // console.log('request.cookies.jwt', request.cookies.jwt);

    try {
      const decoded = jwt.verify(cookie, JWT_SECRET);
      // console.log('user', decoded);

      return true;
    } catch (error: any) {
      return false;
    }
  }
}
