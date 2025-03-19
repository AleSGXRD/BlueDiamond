import { forwardRef, Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from '../client/client.entity';
import { InvoicePaid } from '../invoice-paid/entities/invoice-paid.entity';

import { Service } from '../service/entities/service.entity';
import { GenerateInvoiceService } from '../generate-invoice/generate-invoice.service';
import { ClientService } from '../client/client.service';

import { InvoicePaidRelation } from '../invoice-paid-relation/entities/invoice-paid-relation.entity';
import { HistoryClientModule } from '../history-client/history-client.module';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { HistoryClientService } from '../history-client/history-client.service';
import { HistoryClient } from '../history-client/entities/history-client.entity';
import { ConfigService } from '@nestjs/config';
import { GenerateInvoiceModule } from '../generate-invoice/generate-invoice.module';
import { ClientModule } from '../client/client.module';
import { ServiceExtrawork } from '../service-extrawork/entities/service-extrawork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice,Client,Service,InvoicePaid,InvoicePaidRelation,HistoryClient,ServiceExtrawork]),
  forwardRef(()=>ClientModule), 
  forwardRef(()=> HistoryClientModule)
],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService, TypeOrmModule]
})
export class InvoiceModule {}
