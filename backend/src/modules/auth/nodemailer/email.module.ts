import { Global, Module } from '@nestjs/common';
import { Email2FAService } from './email.service';

@Global()
@Module({
  providers: [Email2FAService],
  exports: [Email2FAService],
})
export class EmailModule {}
