import { NestFactory } from '@nestjs/core';
import { AuthMicroserviceModule } from './auth-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthMicroserviceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
