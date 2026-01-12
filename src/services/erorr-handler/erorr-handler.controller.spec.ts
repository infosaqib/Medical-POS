import { Test, TestingModule } from '@nestjs/testing';
import { ErorrHandlerController } from './erorr-handler.controller';

describe('ErorrHandlerController', () => {
  let controller: ErorrHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErorrHandlerController],
    }).compile();

    controller = module.get<ErorrHandlerController>(ErorrHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
