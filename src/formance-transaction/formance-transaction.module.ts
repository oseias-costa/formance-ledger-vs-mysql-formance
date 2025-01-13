import { Module } from '@nestjs/common';
import { FormanceTransactionService } from './formance-transaction.service';
import { FormanceTransactionController } from './formance-transaction.controller';

@Module({
  controllers: [FormanceTransactionController],
  providers: [FormanceTransactionService],
})
export class FormanceTransactionModule {}
