import { Test, TestingModule } from '@nestjs/testing';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { AuthMicroserviceService } from './auth-microservice.service';

describe('AuthMicroserviceController', () => {
  let authMicroserviceController: AuthMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthMicroserviceController],
      providers: [AuthMicroserviceService],
    }).compile();

    authMicroserviceController = app.get<AuthMicroserviceController>(AuthMicroserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
