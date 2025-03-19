import { Module } from '@nestjs/common';
import { InvoicePaidService } from './invoice-paid.service';
import { InvoicePaidController } from './invoice-paid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicePaid } from './entities/invoice-paid.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Client } from '../client/client.entity';
import { InvoicePaidRelation } from '../invoice-paid-relation/entities/invoice-paid-relation.entity';
import { InvoicePaidRelationService } from '../invoice-paid-relation/invoice-paid-relation.service';

@Module({
  imports:[TypeOrmModule.forFeature([InvoicePaid,InvoicePaidRelation,Invoice,Client]), InvoiceModule],
  controllers: [InvoicePaidController],
  providers: [InvoicePaidService,InvoicePaidRelationService],
})
export class InvoicePaidModule {}
