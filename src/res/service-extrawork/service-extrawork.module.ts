import { Module } from '@nestjs/common';
import { ServiceExtraworkService } from './service-extrawork.service';
import { ServiceExtraworkController } from './service-extrawork.controller';
import { ServiceExtrawork } from './entities/service-extrawork.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceExtraworkItem } from '../service-extrawork-item/entities/service-extrawork-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceExtrawork,ServiceExtraworkItem])],
  controllers: [ServiceExtraworkController],
  providers: [ServiceExtraworkService],
})
export class ServiceExtraworkModule {}
