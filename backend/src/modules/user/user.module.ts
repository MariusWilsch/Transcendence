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
      dest: './Avataruploads/',
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'Avataruploads/')
      },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          const fileExtension = file.originalname.split('.').pop();
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
        },
      }),
    }),
  ],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
