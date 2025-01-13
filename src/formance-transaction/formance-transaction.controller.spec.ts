import { Test, TestingModule } from '@nestjs/testing';
import { FormanceTransactionController } from './formance-transaction.controller';
import { FormanceTransactionService } from './formance-transaction.service';

describe('FormanceTransactionController', () => {
  let controller: FormanceTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormanceTransactionController],
      providers: [FormanceTransactionService],
    }).compile();

    controller = module.get<FormanceTransactionController>(FormanceTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
