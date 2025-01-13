import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { MysqlTransactionModule } from './mysql-transaction/mysql-transaction.module';
import { FormanceTransactionModule } from './formance-transaction/formance-transaction.module';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [MysqlTransactionModule, FormanceTransactionModule],
})
export class DatabaseModule {}
