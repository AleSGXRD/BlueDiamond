import { Module } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimate } from './entities/estimate.entity';
import { Client } from '../client/client.entity';
import { ServiceItem } from '../service-item/service-item.entity';
import { ServiceService } from '../service/service.service';
import { Service } from '../service/entities/service.entity';
import { ClientService } from '../client/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Estimate,Client,ServiceItem, Service])],
  controllers: [EstimateController],
  providers: [EstimateService, ServiceService],
  exports: [EstimateService]
})
export class EstimateModule {}
