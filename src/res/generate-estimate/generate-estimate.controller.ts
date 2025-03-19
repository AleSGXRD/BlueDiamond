import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { GenerateEstimateService } from './generate-estimate.service';
import { ClientService } from '../client/client.service';
import { EstimateService } from '../estimate/estimate.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('generate-estimate')
export class GenerateEstimateController {
    /**
     *
     */
    constructor(private generateEstimateService: GenerateEstimateService,
    ) {
    }
    @Post(':clientId/:serviceId')
    @UseGuards(JwtAuthGuard)
    generateEstimate(@Param('clientId', ParseIntPipe) clientId:number,
            @Param('serviceId', ParseIntPipe) serviceId:number){
        return this.generateEstimateService.generateEstimate(clientId,serviceId);
    }
    @Post('pdf/:clientId/:estimateId')
    @UseGuards(JwtAuthGuard)
    printEstimate(
        @Param('clientId', ParseIntPipe) clientId:number,
        @Param('estimateId', ParseIntPipe) estimateId:number,
                @Body() options : any){

        return this.generateEstimateService.printEstimatePdf(clientId, estimateId, options.send)
    }
    @Get('view-estimate/:estimateId')
    viewPdf(@Param('estimateId', ParseIntPipe) estimateId:number,
        @Res() response:Response){
        return this.generateEstimateService.viewPdf(estimateId,response);
    }
}
