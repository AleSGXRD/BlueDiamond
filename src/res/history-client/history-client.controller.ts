import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HistoryClientService } from './history-client.service';
import { CreateHistoryClientDto } from './dto/create-history-client.dto';
import { UpdateHistoryClientDto } from './dto/update-history-client.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('history-client')
@UseGuards(JwtAuthGuard)
export class HistoryClientController {
  constructor(private readonly historyClientService: HistoryClientService) {}

  @Post()
  create(@Body() createHistoryClientDto: CreateHistoryClientDto) {
    return this.historyClientService.create(createHistoryClientDto);
  }

  @Get()
  findAll() {
    return this.historyClientService.findAll();
  }

  @Get(':id/:date')
  findOne(@Param('id', ParseIntPipe) id: number,
          @Param('date', ParseDatePipe) date : Date) {
    return this.historyClientService.findOne(id, date);
  }

  @Patch(':id/:date')
  update(@Param('id', ParseIntPipe) id: number,
         @Param('date', ParseDatePipe) date : Date,
         @Body() updateHistoryClientDto: UpdateHistoryClientDto) {
    return this.historyClientService.update(id,date, updateHistoryClientDto);
  }

  @Delete(':id/:date')
  remove(@Param('id', ParseIntPipe) id: number,
         @Param('date', ParseDatePipe) date : Date) {
    return this.historyClientService.remove(id,date);
  }
}
