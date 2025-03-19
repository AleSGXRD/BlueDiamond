import { Module } from '@nestjs/common';
import { ServiceItemController } from './service-item.controller';
import { ServiceItemService } from './service-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceItem } from './service-item.entity';
import { Invoice } from '../invoice/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceItem,Invoice])],
  controllers: [ServiceItemController],
  providers: [ServiceItemService]
})
export class ServiceItemModule {}
