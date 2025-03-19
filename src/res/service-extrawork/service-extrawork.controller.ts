import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateServiceExtraworkDto } from './dto/create-service-extrawork.dto';
import { ServiceExtraworkService } from './service-extrawork.service';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { UpdateServiceExtraworkDto } from './dto/update-service-extrawork.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('service-extrawork')
@UseGuards(JwtAuthGuard)
export class ServiceExtraworkController {
  constructor(private readonly ServiceExtraworkService: ServiceExtraworkService) {}

  @Post()
  create(@Body() createServiceExtraworkDto: CreateServiceExtraworkDto) {
    return this.ServiceExtraworkService.create(createServiceExtraworkDto);
  }

  @Get()
  findAll() {
    return this.ServiceExtraworkService.findAll();
  }

  @Get(':clientId/:itemId/:date')
  findOne(@Param('clientId', ParseIntPipe) clientId: number,
          @Param('itemId', ParseIntPipe) itemId: number,
          @Param('date', ParseDatePipe) date : Date) {
    return this.ServiceExtraworkService.findOne(clientId,itemId, date);
  }

  @Patch(':cliendId/:itemId/:date')
  update(@Param('clientId', ParseIntPipe) clientId: number,
          @Param('itemId', ParseIntPipe) itemId: number,
          @Param('date', ParseDatePipe) date : Date,
         @Body() updateServiceExtraworkDto: UpdateServiceExtraworkDto) {
    return this.ServiceExtraworkService.update(clientId,itemId,date, updateServiceExtraworkDto);
  }

  @Delete(':cliendId/:itemId/:date')
  remove(@Param('clientId', ParseIntPipe) clientId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Param('date', ParseDatePipe) date : Date) {
    return this.ServiceExtraworkService.remove(clientId,itemId,date);
  }
}
