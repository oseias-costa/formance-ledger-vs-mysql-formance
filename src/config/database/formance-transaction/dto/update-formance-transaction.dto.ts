import { PartialType } from '@nestjs/mapped-types';
import { CreateFormanceTransactionDto } from './create-formance-transaction.dto';

export class UpdateFormanceTransactionDto extends PartialType(CreateFormanceTransactionDto) {}
