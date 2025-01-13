import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MysqlTransactionService } from './mysql-transaction.service';
import { CreateMysqlTransactionDto } from './dto/create-mysql-transaction.dto';
import { UpdateMysqlTransactionDto } from './dto/update-mysql-transaction.dto';

@Controller('mysql-transaction')
export class MysqlTransactionController {
  constructor(private readonly mysqlTransactionService: MysqlTransactionService) {}

  @Post()
  create(@Body() createMysqlTransactionDto: CreateMysqlTransactionDto) {
    return this.mysqlTransactionService.create(createMysqlTransactionDto);
  }

  @Get()
  findAll() {
    return this.mysqlTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mysqlTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMysqlTransactionDto: UpdateMysqlTransactionDto) {
    return this.mysqlTransactionService.update(+id, updateMysqlTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mysqlTransactionService.remove(+id);
  }
}
