import { PartialType } from '@nestjs/mapped-types';
import { CreateMysqlTransactionDto } from './create-mysql-transaction.dto';

export class UpdateMysqlTransactionDto extends PartialType(CreateMysqlTransactionDto) {}
