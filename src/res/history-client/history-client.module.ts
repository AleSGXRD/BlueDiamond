import { forwardRef, Module } from '@nestjs/common';
import { HistoryClientService } from './history-client.service';
import { HistoryClientController } from './history-client.controller';
import { HistoryClient } from './entities/history-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryClient]), forwardRef(()=>ClientModule)],
  controllers: [HistoryClientController],
  providers: [HistoryClientService],
  exports: [HistoryClientService, TypeOrmModule]
})
export class HistoryClientModule {}
