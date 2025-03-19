import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('rol')
@UseGuards(JwtAuthGuard)
export class RolController {
  
    /**
     *
     */
    constructor(private RolService : RolService) {}
    
    @Get()
    selectInvoceItem(){
        return this.RolService.getItems();
    }
    @Get(':id')
    getInvoceItem(@Param('id', ParseIntPipe) id:number){
        return this.RolService.getItem(id);
    }

    @Post()
    createInvoceItem(@Body() newInvoceItem:CreateRolDto){
        return this.RolService.createItem(newInvoceItem);
    }

    @Patch(':id')
    updateInvoceItem(@Param('id', ParseIntPipe) id:number, @Body() updateInvoceItem:UpdateRolDto){
        return this.RolService.updateItem(id, updateInvoceItem);
    }

    @Delete(':id')
    deleteInvoceItem(@Param('id', ParseIntPipe) id : number){
        return this.RolService.deleteItem(id);
    }
}
