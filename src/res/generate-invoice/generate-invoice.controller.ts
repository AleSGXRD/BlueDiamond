import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { GenerateInvoiceService } from './generate-invoice.service';
import { ClientService } from '../client/client.service';
import { Client } from '../client/client.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('pdf')
export class GenerateInvoiceController {
  constructor(private readonly generateInvoiceService: GenerateInvoiceService,
            private readonly clientService: ClientService) {}

  @Post('generate-invoice')
@UseGuards(JwtAuthGuard)
printAllClientsInvoices(
          @Body() options : any){
      return this.generateInvoiceService.generateAllClientsInvoices(options.print,options.send);
  }
  @Post('generate-invoice/:clientId')
@UseGuards(JwtAuthGuard)
async printAllInvoices(
          @Param('clientId', ParseIntPipe) clientId:number,
          @Body() options : any){
      const client = await this.clientService.getItem(clientId)
      if(client instanceof Client)
          return this.generateInvoiceService.generateAllInvoicesOfClient(client,options.print,options.send);
      else
          return client //Porque es un error
  }
  @Post('generate-invoice/:clientId/:serviceId')
@UseGuards(JwtAuthGuard)
async printAllInvoicesOfService(
          @Param('clientId', ParseIntPipe) clientId:number,
          @Param('serviceId', ParseIntPipe) serviceId:number,
          @Body() options : any){
      const client = await this.clientService.getItem(clientId)
      if(client instanceof Client)
          return this.generateInvoiceService.generateAllInvoicesOfClientOfOneService(client,serviceId,options.print,options.send);
      else
          return client //Porque es un error
  }
  @Post('generate-invoice/:clientId/:serviceId/:invoiceId/')
@UseGuards(JwtAuthGuard)
async printOneInvoicesOfService(
          @Param('clientId', ParseIntPipe) clientId:number,
          @Param('serviceId', ParseIntPipe) serviceId:number,
          @Param('invoiceId', ParseIntPipe) invoiceId:number,
          @Body() options : any){
      const client = await this.clientService.getItem(clientId)
      if(client instanceof Client){
          return this.generateInvoiceService.generateInvoiceOfClientOfOneService(client,serviceId,invoiceId,options.print,options.send);
      }else
          return client //Porque es un error
  }
@Get('view-invoice/:invoiceId')
viewPdf(@Param('invoiceId', ParseIntPipe) invoiceId:number,
    @Res() response:Response){
    return this.generateInvoiceService.viewPdf(invoiceId,response);
}
}
