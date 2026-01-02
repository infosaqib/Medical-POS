import { Module } from '@nestjs/common';
import { ErorrHandlerController } from './erorr-handler.controller';
import { ErorrHandlerService } from './erorr-handler.service';

@Module({
  controllers: [ErorrHandlerController],
  providers: [ErorrHandlerService]
})
export class ErorrHandlerModule {}
