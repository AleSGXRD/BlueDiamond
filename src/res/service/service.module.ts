import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Client } from '../client/client.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Estimate } from '../estimate/entities/estimate.entity';
import { ClientModule } from '../client/client.module';
import { HistoryClientModule } from '../history-client/history-client.module';
import { HistoryClient } from '../history-client/entities/history-client.entity';
import { ClientService } from '../client/client.service';
import { HistoryClientService } from '../history-client/history-client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service,Client,Invoice, Estimate, HistoryClient])],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService]
})
export class ServiceModule {}
