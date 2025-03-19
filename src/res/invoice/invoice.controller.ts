import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('invoice')
@UseGuards(JwtAuthGuard)

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':invoiceId')
  findOne(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.invoiceService.findOne(invoiceId);
  }

  @Patch(':invoiceId/:clientId/:itemId/:serviceId')
  update(@Param('invoiceId', ParseIntPipe) invoiceId: number,
          @Param('clientId', ParseIntPipe) clientId: number,
          @Param('itemId', ParseIntPipe) itemId: number,
          @Param('serviceId', ParseIntPipe) serviceId : number,
         @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(invoiceId,clientId,itemId,serviceId, updateInvoiceDto);
  }

  @Delete(':invoiceId')
  remove(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.invoiceService.remove(invoiceId);
  }    
}
