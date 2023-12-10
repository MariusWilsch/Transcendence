import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads/', // Specify your destination folder
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtension = file.originalname.split('.').pop();
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
        },
      }),
    }),
  ],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  exports: [UserService], // allowing the user service to be used in other modules
})
export class UserModule {}
