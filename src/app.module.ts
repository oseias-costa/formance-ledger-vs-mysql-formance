import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormanceTransactionModule } from './formance-transaction/formance-transaction.module';
import { MysqlTransactionModule } from './mysql-transaction/mysql-transaction.module';

@Module({
  imports: [FormanceTransactionModule, MysqlTransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
