import { Module } from '@nestjs/common';
import { MysqlTransactionService } from './mysql-transaction.service';
import { MysqlTransactionController } from './mysql-transaction.controller';

@Module({
  controllers: [MysqlTransactionController],
  providers: [MysqlTransactionService],
})
export class MysqlTransactionModule {}
