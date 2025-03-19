import { Module } from '@nestjs/common';
import { ServiceExtraworkItemService } from './service-extrawork-item.service';
import { ServiceExtraworkItemController } from './service-extrawork-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceExtraworkItem } from './entities/service-extrawork-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceExtraworkItem])],
  controllers: [ServiceExtraworkItemController],
  providers: [ServiceExtraworkItemService],
})
export class ServiceExtraworkItemModule {}
