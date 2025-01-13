import { Test, TestingModule } from '@nestjs/testing';
import { MysqlTransactionController } from './mysql-transaction.controller';
import { MysqlTransactionService } from './mysql-transaction.service';

describe('MysqlTransactionController', () => {
  let controller: MysqlTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MysqlTransactionController],
      providers: [MysqlTransactionService],
    }).compile();

    controller = module.get<MysqlTransactionController>(MysqlTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
