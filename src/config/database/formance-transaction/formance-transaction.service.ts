import { Injectable } from '@nestjs/common';
import { CreateFormanceTransactionDto } from './dto/create-formance-transaction.dto';
import { UpdateFormanceTransactionDto } from './dto/update-formance-transaction.dto';

@Injectable()
export class FormanceTransactionService {
  create(createFormanceTransactionDto: CreateFormanceTransactionDto) {
    return 'This action adds a new formanceTransaction';
  }

  findAll() {
    return `This action returns all formanceTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formanceTransaction`;
  }

  update(id: number, updateFormanceTransactionDto: UpdateFormanceTransactionDto) {
    return `This action updates a #${id} formanceTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} formanceTransaction`;
  }
}
