import { Get, Post, Body, Patch, Param, Delete, Controller, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UseraccountService } from './useraccount.service';
import { CreateUseraccountDto } from './dto/create-useraccount.dto';
import { UpdateUseraccountDto } from './dto/update-useraccount.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('useraccount')
@UseGuards(JwtAuthGuard)
export class UseraccountController {
  
    /**
     *
     */
    constructor(private UseraccountService : UseraccountService) {}
    
    @Get()
    selectInvoceItem(){
        return this.UseraccountService.getItems();
    }
    @Get(':id')
    getInvoceItem(@Param('id', ParseIntPipe) id:number){
        return this.UseraccountService.getItem(id);
    }

    @Post()
    createInvoceItem(@Body() newInvoceItem:CreateUseraccountDto){
        return this.UseraccountService.createItem(newInvoceItem);
    }

    @Patch(':id')
    updateInvoceItem(@Param('id', ParseIntPipe) id:number, @Body() updateInvoceItem:UpdateUseraccountDto){
        return this.UseraccountService.updateItem(id, updateInvoceItem);
    }

    @Delete(':id')
    deleteInvoceItem(@Param('id', ParseIntPipe) id : number){
        return this.UseraccountService.deleteItem(id);
    }
}
