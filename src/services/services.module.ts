import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { JwtModule } from './jwt/jwt.module';
import { ErorrHandlerModule } from './erorr-handler/erorr-handler.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [JwtModule, ErorrHandlerModule]
})
export class ServicesModule {}
