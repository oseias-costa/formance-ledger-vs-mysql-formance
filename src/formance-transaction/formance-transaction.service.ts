import { Injectable } from '@nestjs/common';
import { CreateFormanceTransactionDto } from './dto/create-formance-transaction.dto';
import { UpdateFormanceTransactionDto } from './dto/update-formance-transaction.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class FormanceTransactionService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://localhost:8080',
      timeout: 5000,
    });
  }

  create(createFormanceTransactionDto: CreateFormanceTransactionDto) {
    return 'This action adds a new formanceTransaction';
  }

  findAll() {
    return `This action returns all formanceTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formanceTransaction`;
  }

  update(
    id: number,
    updateFormanceTransactionDto: UpdateFormanceTransactionDto,
  ) {
    return `This action updates a #${id} formanceTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} formanceTransaction`;
  }
}
