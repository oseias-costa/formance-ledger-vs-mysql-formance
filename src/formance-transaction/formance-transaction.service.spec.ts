import { Test, TestingModule } from '@nestjs/testing';
import { FormanceTransactionService } from './formance-transaction.service';

describe('FormanceTransactionService', () => {
  let service: FormanceTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormanceTransactionService],
    }).compile();

    service = module.get<FormanceTransactionService>(FormanceTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
