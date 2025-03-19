import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryClientModule } from '../history-client/history-client.module';
import { Invoice } from '../invoice/entities/invoice.entity';
import { ServiceExtrawork } from '../service-extrawork/entities/service-extrawork.entity';
import { InvoicePaid } from '../invoice-paid/entities/invoice-paid.entity';
import { InvoicePaidRelation } from '../invoice-paid-relation/entities/invoice-paid-relation.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { ConfigService } from '@nestjs/config';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { ServiceService } from '../service/service.service';
import { Estimate } from '../estimate/entities/estimate.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Client,Invoice,ServiceExtrawork, InvoicePaid, InvoicePaidRelation,Estimate]), forwardRef(()=>InvoiceModule), forwardRef(()=> HistoryClientModule)],
  providers: [ClientService, ServiceService , ConfigService, SenderMailsService],
  controllers: [ClientController],
  exports: [ClientService, TypeOrmModule]
})
export class ClientModule {}
