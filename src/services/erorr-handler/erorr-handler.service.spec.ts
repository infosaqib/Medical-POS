import { Test, TestingModule } from '@nestjs/testing';
import { ErorrHandlerService } from './erorr-handler.service';

describe('ErorrHandlerService', () => {
  let service: ErorrHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErorrHandlerService],
    }).compile();

    service = module.get<ErorrHandlerService>(ErorrHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
