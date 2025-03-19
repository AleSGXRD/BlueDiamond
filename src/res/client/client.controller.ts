import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CreateClientWithHistoryDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientService } from './client.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('client')
export class ClientController {
    constructor(private clientService : ClientService) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    selectClient(){
        return this.clientService.getItems();
    }
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getClient(@Param('id', ParseIntPipe) id:number){
        return this.clientService.getItem(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createClient(@Body() newClient:CreateClientWithHistoryDto){
        return this.clientService.createItem(newClient.client, newClient.history);
    }

    @Post(':id')
    @UseGuards(JwtAuthGuard)
    sendOfferClient(@Param('id', ParseIntPipe) id :number,
        @Body() options : any){
        return this.clientService.sendOffer(id, options.send);
    }
    @Get('approve/:id')
    @UseGuards(JwtAuthGuard)
    approveOfferClient(@Param('id',ParseIntPipe) id :number){
        return this.clientService.approveOffer(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateClient(@Param('id', ParseIntPipe) id:number, @Body() updateClient:UpdateClientDto){
        return this.clientService.updateItem(id, updateClient);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteClient(@Param('id', ParseIntPipe) id : number){
        return this.clientService.deleteItem(id);
    }
    @Get('view-service-offer/:id')
    viewPdf(@Param('id', ParseIntPipe) clientId:number,
        @Res() response:Response){
        return this.clientService.viewPdf(clientId,response);
    }
}
