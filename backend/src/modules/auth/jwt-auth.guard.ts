
import { Injectable, CanActivate, ExecutionContext, Logger  } from '@nestjs/common';
import { JWT_SECRET } from './constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies.jwt ;

    try {
      const decoded = jwt.verify(cookie, JWT_SECRET);
      console.log('user', decoded);

      return true;
    } catch (error : any) {
      this.logger.error('Error verifying access token:', error.message);
      return false;
    }
  }
}