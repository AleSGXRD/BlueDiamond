import { forwardRef, Module } from '@nestjs/common';
import { GenerateEstimateService } from './generate-estimate.service';
import { GenerateEstimateController } from './generate-estimate.controller';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { EstimateModule } from '../estimate/estimate.module';
import { Client } from '../client/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimate } from '../estimate/entities/estimate.entity';
import { Service } from '../service/entities/service.entity';
import { HistoryClient } from '../history-client/entities/history-client.entity';
import { ClientService } from '../client/client.service';
import { ClientModule } from '../client/client.module';
import { HistoryClientModule } from '../history-client/history-client.module';
import { ServiceService } from '../service/service.service';

@Module({
  imports:[TypeOrmModule.forFeature([Client, Estimate, Service]),
    EstimateModule,
    forwardRef(()=> ClientModule),
    forwardRef(()=> HistoryClientModule)],
  controllers: [GenerateEstimateController],
  providers: [GenerateEstimateService, SenderMailsService, ServiceService],
})
export class GenerateEstimateModule {}
