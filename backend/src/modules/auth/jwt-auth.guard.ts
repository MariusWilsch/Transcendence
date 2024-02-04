import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Redirect,
} from '@nestjs/common';
import { JWT_SECRET } from './constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies.jwt;
    if (!cookie) {
      return false;
    }
    try {
      const decoded = jwt.verify(cookie, JWT_SECRET);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
