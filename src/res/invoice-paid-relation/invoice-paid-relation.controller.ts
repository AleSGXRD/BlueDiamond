import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateInvoicePaidRelationDto } from './dto/create-invoice-paid-relation.dto';
import { UpdateInvoicePaidRelationDto } from './dto/update-invoice-paid-relation.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { InvoicePaidRelationService } from './invoice-paid-relation.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('invoice-paid-relation')
@UseGuards(JwtAuthGuard)
export class InvoicePaidRelationController {
  constructor(private readonly invoicePaidRelationService: InvoicePaidRelationService) {}

  @Post()
  create(@Body() createInvoicePaidRelationDto: CreateInvoicePaidRelationDto) {
    return this.invoicePaidRelationService.create(createInvoicePaidRelationDto);
  }

  @Get()
  findAll() {
    return this.invoicePaidRelationService.findAll();
  }

  @Get(':paidDate/:serviceId/:clientId')
  findOne(@Param('paidDate', ParseDatePipe) paidDate :Date,
          @Param('serviceId', ParseIntPipe) serviceId:number,
          @Param('clientId',ParseDatePipe) clientId:number) {
    return this.invoicePaidRelationService.findOne(paidDate, serviceId, clientId);
  }

  @Patch(':paidDate/:serviceId/:clientId')
  update(@Param('paidDate', ParseDatePipe) paidDate :Date,
          @Param('serviceId', ParseIntPipe) serviceId:number,
          @Param('clientId',ParseDatePipe) clientId:number,
          @Body() updateInvoicePaidRelationDto: UpdateInvoicePaidRelationDto) {
    return this.invoicePaidRelationService.update(paidDate, serviceId, clientId, updateInvoicePaidRelationDto);
  }

  @Delete(':paidDate/:serviceId/:clientId')
  remove(@Param('paidDate', ParseDatePipe) paidDate :Date,
          @Param('serviceId', ParseIntPipe) serviceId:number,
          @Param('clientId',ParseIntPipe) clientId:number) {
    return this.invoicePaidRelationService.remove(paidDate, serviceId, clientId);
  }
}
