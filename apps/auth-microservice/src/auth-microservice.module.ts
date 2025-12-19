import { Module } from '@nestjs/common';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { AuthMicroserviceService } from './auth-microservice.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ValidationsModule } from './validations/validations.module';

@Module({
  imports: [AuthenticationModule, ValidationsModule],
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService],
})
export class AuthMicroserviceModule {}
