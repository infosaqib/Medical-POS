import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
