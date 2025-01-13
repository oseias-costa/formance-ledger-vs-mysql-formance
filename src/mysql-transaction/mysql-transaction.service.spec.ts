import { Test, TestingModule } from '@nestjs/testing';
import { MysqlTransactionService } from './mysql-transaction.service';

describe('MysqlTransactionService', () => {
  let service: MysqlTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MysqlTransactionService],
    }).compile();

    service = module.get<MysqlTransactionService>(MysqlTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
