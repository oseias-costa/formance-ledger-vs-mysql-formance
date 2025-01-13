import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormanceTransactionService } from './formance-transaction.service';
import { CreateFormanceTransactionDto } from './dto/create-formance-transaction.dto';
import { UpdateFormanceTransactionDto } from './dto/update-formance-transaction.dto';

@Controller('formance-transaction')
export class FormanceTransactionController {
  constructor(private readonly formanceTransactionService: FormanceTransactionService) {}

  @Post()
  create(@Body() createFormanceTransactionDto: CreateFormanceTransactionDto) {
    return this.formanceTransactionService.create(createFormanceTransactionDto);
  }

  @Get()
  findAll() {
    return this.formanceTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formanceTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormanceTransactionDto: UpdateFormanceTransactionDto) {
    return this.formanceTransactionService.update(+id, updateFormanceTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formanceTransactionService.remove(+id);
  }
}
