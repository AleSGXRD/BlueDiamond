import { forwardRef, Module } from '@nestjs/common';
import { GenerateInvoiceService } from './generate-invoice.service';
import { GenerateInvoiceController } from './generate-invoice.controller';
import { InvoiceService } from '../invoice/invoice.service';
import { ClientService } from '../client/client.service';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicePaidRelation } from '../invoice-paid-relation/entities/invoice-paid-relation.entity';
import { InvoicePaid } from '../invoice-paid/entities/invoice-paid.entity';
import { ServiceExtrawork } from '../service-extrawork/entities/service-extrawork.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Client } from '../client/client.entity';
import { HistoryClient } from '../history-client/entities/history-client.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { ClientModule } from '../client/client.module';
import { HistoryClientModule } from '../history-client/history-client.module';
import { ConfigService } from '@nestjs/config';
import { Service } from '../service/entities/service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Client,Invoice,Service,ServiceExtrawork, InvoicePaid, InvoicePaidRelation,HistoryClient]), 
      forwardRef(()=>ClientModule), 
      forwardRef(()=>HistoryClientModule),
      forwardRef(()=>InvoiceModule)],
  controllers: [GenerateInvoiceController],
  providers: [GenerateInvoiceService, SenderMailsService,ConfigService],
  exports:[GenerateInvoiceService, SenderMailsService,ConfigService, TypeOrmModule]
})
export class GenerateInvoiceModule {}
