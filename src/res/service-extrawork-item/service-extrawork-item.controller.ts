import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ServiceExtraworkItemService } from './service-extrawork-item.service';
import { CreateServiceExtraworkItemDto } from './dto/create-service-extrawork-item.dto';
import { UpdateServiceExtraworkItemDto } from './dto/update-service-extrawork-item.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('service-extrawork-item')
@UseGuards(JwtAuthGuard)
export class ServiceExtraworkItemController {

  /**
   *
   */
  constructor(private ServiceExtraworkItemService : ServiceExtraworkItemService) {}
  
  @Get()
  selectInvoceItem(){
      return this.ServiceExtraworkItemService.findAll();
  }
  @Get(':id')
  getInvoceItem(@Param('id', ParseIntPipe) id:number){
      return this.ServiceExtraworkItemService.findOne(id);
  }

  @Post()
  createInvoceItem(@Body() newInvoceItem:CreateServiceExtraworkItemDto){
      return this.ServiceExtraworkItemService.create(newInvoceItem);
  }

  @Patch(':id')
  updateInvoceItem(@Param('id', ParseIntPipe) id:number, @Body() updateInvoceItem:UpdateServiceExtraworkItemDto){
      return this.ServiceExtraworkItemService.update(id, updateInvoceItem);
  }

  @Delete(':id')
  deleteInvoceItem(@Param('id', ParseIntPipe) id : number){
      return this.ServiceExtraworkItemService.remove(id);
  }
}
