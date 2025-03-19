import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InvoicePaidService } from './invoice-paid.service';
import { CreateInvoicePaidDto } from './dto/create-invoice-paid.dto';
import { UpdateInvoicePaidDto } from './dto/update-invoice-paid.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('invoice-paid')
@UseGuards(JwtAuthGuard)
export class InvoicePaidController {
  constructor(private readonly invoicePaidService: InvoicePaidService) {}

  @Post()
  create(@Body() createInvoicePaidDto: CreateInvoicePaidDto) {
    return this.invoicePaidService.create(createInvoicePaidDto);
  }

  @Get()
  findAll() {
    return this.invoicePaidService.findAll();
  }

  @Get(':paidDate')
  findOne(@Param('paidDate', ParseDatePipe) paidDate :Date) {
    return this.invoicePaidService.findOne(paidDate);
  }

  @Patch(':paidDate')
  update(@Param('paidDate', ParseDatePipe) paidDate :Date,
          @Body() updateInvoicePaidDto: UpdateInvoicePaidDto) {
    return this.invoicePaidService.update(paidDate, updateInvoicePaidDto);
  }

  @Delete(':paidDate')
  remove(@Param('paidDate', ParseDatePipe) paidDate :Date,) {
    return this.invoicePaidService.remove(paidDate);
  }
}
