import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, UseGuards } from '@nestjs/common';
import { CreateServiceItemDto } from './dto/create-service-item.dto';
import { ServiceItemService } from './service-item.service';
import { UpdateServiceItemDto } from './dto/update-service-item.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('service-item')
@UseGuards(JwtAuthGuard)
export class ServiceItemController {

    /**
     *
     */
    constructor(private ServiceItemService : ServiceItemService) {}
    
    @Get()
    selectInvoceItem(){
        return this.ServiceItemService.getItems();
    }
    @Get(':id')
    getInvoceItem(@Param('id', ParseIntPipe) id:number){
        return this.ServiceItemService.getItem(id);
    }

    @Post()
    createInvoceItem(@Body() newInvoceItem:CreateServiceItemDto){
        return this.ServiceItemService.createItem(newInvoceItem);
    }

    @Patch(':id')
    updateInvoceItem(@Param('id', ParseIntPipe) id:number, @Body() updateInvoceItem:UpdateServiceItemDto){
        return this.ServiceItemService.updateItem(id, updateInvoceItem);
    }

    @Delete(':id')
    deleteInvoceItem(@Param('id', ParseIntPipe) id : number){
        return this.ServiceItemService.deleteItem(id);
    }
}
