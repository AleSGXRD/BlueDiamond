import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateServiceDto[]) {
    return this.serviceService.create(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':clientId/:itemId/:serviceId')
  findOne(@Param('clientId', ParseIntPipe) clientId: number,
          @Param('itemId', ParseIntPipe) itemId: number,
          @Param('serviceId', ParseIntPipe) serviceId : number) {
    return this.serviceService.findOne(clientId,itemId, serviceId);
  }

  @Patch('')
  update(@Body() updateInvoiceDto: UpdateServiceDto[]) {
    return this.serviceService.update(updateInvoiceDto);
  }

  @Delete(':clientId/:serviceId')
  remove(@Param('clientId', ParseIntPipe) clientId: number,
        @Param('serviceId', ParseIntPipe) serviceId : number) {
    return this.serviceService.remove(clientId,serviceId);
  }
  @Delete(':cliendId/:itemId/:serviceId')
  removeItem(@Param('clientId', ParseIntPipe) clientId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Param('serviceId', ParseIntPipe) serviceId : number) {
    return this.serviceService.removeItem(clientId,serviceId, itemId);
  }
}
