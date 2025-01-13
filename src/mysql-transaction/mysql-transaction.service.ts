import { Injectable } from '@nestjs/common';
import { CreateMysqlTransactionDto } from './dto/create-mysql-transaction.dto';
import { UpdateMysqlTransactionDto } from './dto/update-mysql-transaction.dto';

@Injectable()
export class MysqlTransactionService {
  create(createMysqlTransactionDto: CreateMysqlTransactionDto) {
    return 'This action adds a new mysqlTransaction';
  }

  findAll() {
    return `This action returns all mysqlTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mysqlTransaction`;
  }

  update(id: number, updateMysqlTransactionDto: UpdateMysqlTransactionDto) {
    return `This action updates a #${id} mysqlTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} mysqlTransaction`;
  }
}
