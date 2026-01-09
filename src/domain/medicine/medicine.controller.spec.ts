import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from './medicine.controller';

describe('MedicineController', () => {
  let controller: MedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineController],
    }).compile();

    controller = module.get<MedicineController>(MedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
