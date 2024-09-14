import { Test, TestingModule } from '@nestjs/testing';
import { BonusesController } from './bonuses.controller';

describe('BonusesController', () => {
  let controller: BonusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusesController],
    }).compile();

    controller = module.get<BonusesController>(BonusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
