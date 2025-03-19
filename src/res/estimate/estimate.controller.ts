import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { Service } from '../service/entities/service.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('estimate')
@UseGuards(JwtAuthGuard)
export class EstimateController {
  
    constructor(private readonly estimateService: EstimateService) {}
  
    @Post()
    create(@Body() createEstimateDto: CreateEstimateDto) {
      return this.estimateService.create(createEstimateDto);
    }
    @Post(':estimateId')
    approveEstimate(@Param('estimateId', ParseIntPipe) estimateId:number){
      return this.estimateService.approveEstimate(estimateId);
    }
  
    @Get()
    findAll() {
      return this.estimateService.findAll();
    }
  
    @Get(':invoiceId')
    findOne(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
      return this.estimateService.findOne(invoiceId);
    }
    @Patch(':estimateId/:clientId/:itemId/:serviceDate')
    update(@Param('estimateId', ParseIntPipe) invoiceId: number,
            @Param('clientId', ParseIntPipe) clientId: number,
            @Param('itemId', ParseIntPipe) itemId: number,
            @Param('serviceDate', ParseDatePipe) serviceId : number,
           @Body() updateEstimateDto:UpdateEstimateDto) {
      return this.estimateService.update(invoiceId,clientId,itemId,serviceId,updateEstimateDto);
    }
  
    @Delete(':invoiceId')
    remove(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
      return this.estimateService.remove(invoiceId);
    }
}
