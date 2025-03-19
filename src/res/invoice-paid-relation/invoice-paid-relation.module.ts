import { Module } from '@nestjs/common';
import { InvoicePaidRelationService } from './invoice-paid-relation.service';
import { InvoicePaidRelationController } from './invoice-paid-relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModule } from '../invoice/invoice.module';
import { Client } from '../client/client.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoicePaidRelation } from './entities/invoice-paid-relation.entity';
import { InvoicePaid } from '../invoice-paid/entities/invoice-paid.entity';

@Module({
  imports:[TypeOrmModule.forFeature([InvoicePaid,InvoicePaidRelation,Invoice,Client]), InvoiceModule],
  controllers: [InvoicePaidRelationController],
  providers: [InvoicePaidRelationService],
})
export class InvoicePaidRelationModule {}
