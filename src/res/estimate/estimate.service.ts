import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { Estimate } from './entities/estimate.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from '../service/service.service';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class EstimateService {
  constructor(@InjectRepository(Estimate) private repositoryEstimate : Repository<Estimate>,
              @InjectRepository(Service) private repositoryService : Repository<Service>) {}
  
    async getLastId(){
        const items = (await this.repositoryEstimate.find()).sort((a,b)=> b.estimateId - a.estimateId);
        if(items.length == 0)
            return 0;
        
        return items[0].estimateId + 1;
    }
    
    async create(createEstimateDto: CreateEstimateDto) {
      const item = await this.repositoryEstimate.findOne({
        where: {
          clientId: createEstimateDto.clientId,
          itemId: createEstimateDto.itemId,
          serviceId: createEstimateDto.serviceId
        }
      });
      if(item)
        return new HttpException("Item already exists", HttpStatus.CONFLICT)
      const newInvoice = this.repositoryEstimate.create(createEstimateDto);
      return this.repositoryEstimate.save(newInvoice);
    }
  
    async generateEstimate(estimateDate : Date, services :any[], commercial:boolean): Promise<Estimate[]>{
        const estimateId = (await this.getLastId());
        let estimateSaved = [];
        // console.log(estimateId)
        for(const service of services){
            const estimate: CreateEstimateDto = {
                estimateId,
                clientId: service.clientId,
                itemId: service.itemId,
                itemName: service.item.name,
                serviceId: service.serviceId,
                estimateDate,
                discount : service.discount,
                quantity : service.quantity,
                estimateApproved : false,
                price : (commercial == false ? service.item.price: service.item.priceCommercial)
            }
            const result = await this.addEstimate(estimate)
            estimateSaved.push(result)
        }
        return estimateSaved
    }
    async generateEstimateWithId(estimateDate : Date, services :any[], estimateId:number, commercial:boolean): Promise<Estimate[]>{
      let estimateSaved = [];
      // console.log(estimateId)
      for(const service of services){
          const estimate: CreateEstimateDto = {
              estimateId,
              clientId: service.clientId,
              itemId: service.itemId,
              itemName: service.item.name,
              serviceId: service.serviceId,
              estimateDate,
              discount : service.discount,
              quantity : service.quantity,
              estimateApproved : false,
              price : (commercial == false ? service.item.price: service.item.priceCommercial)
          }
          const result = await this.addEstimate(estimate)
          estimateSaved.push(result)
      }
      return estimateSaved
  }
  
    async addEstimate(estimate: CreateEstimateDto){
        if(estimate.clientId == undefined){
            estimate.clientId = (await this.getLastId());
        }
        const createdInvoice = this.repositoryEstimate.create(estimate);
        const saveInvoice = await this.repositoryEstimate.save(createdInvoice);
        return saveInvoice;
    }
  
    findAll() {
      return this.repositoryEstimate.find({
        relations: ['service', 'paid']
      });
    }
  
    async findOne(estimateId:number) {
      const item = await this.repositoryEstimate.findOne({
        where: {
          estimateId
        },
        relations: ['service']
      });
      if(!item)
        throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
      
      return item
    }
  
    async update(estimateId:number,clientId: number,itemId:number,serviceId : number, updateEstimateDto: UpdateEstimateDto) {
      const item = await this.repositoryEstimate.findOne({
        where: {
          estimateId,
          clientId: clientId,
          itemId: itemId,
          serviceId: serviceId
        }
      });
      if(!item)
        return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
  
      return this.repositoryEstimate.update({estimateId,clientId, itemId, serviceId}, updateEstimateDto);
    }
    async approveEstimate(estimateId:number){
      const items = await this.repositoryEstimate.find({
        where:{
          estimateId 
        }
      })
      if(items.length == 0)
        throw new HttpException("There are not estimates with that id", HttpStatus.BAD_REQUEST)
      const resultUpdateEstimate = await this.repositoryEstimate.update({estimateId},{estimateApproved : true})
      if(resultUpdateEstimate.affected == 0)
        throw new HttpException("Has happened an error tryng to approve the estimates", HttpStatus.AMBIGUOUS)

      const {serviceId} = items[0]
      const result = await this.repositoryService.update(
        {
          serviceId
        },
        { active : true }
      );
      if(!result)
        throw new HttpException("Has happened an error trying to approve the service", HttpStatus.AMBIGUOUS)
      return {message:"Se ha actualizado el servicio con exito."};
    }
  
    async remove(estimateId: number) {
      const result = await this.repositoryEstimate.delete({estimateId});
      if(result.affected === 0)
        return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
  
      return result;
    }
    async removeEstimates(estimates: Estimate[]){
      const {estimateId} = estimates[0];
      const estimateItemIds = [...new Set(estimates.map(estimate => estimate.itemId))];
      let resultAll = 0;
      for(const itemId of estimateItemIds){
        const result = await this.repositoryEstimate.delete({estimateId,itemId})

        if(result.affected === 0)
          return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else
          resultAll +=1;
      }
      return resultAll;
    }
    async updateEstimate(estimateId:number,services:Service[], commercial : boolean){
      if(!(services.length > 0))
        return new HttpException("There is not invoices to update their direction", HttpStatus.BAD_REQUEST);

      let resultUpdate = 0;
      for(const service of services){
        const {clientId, itemId, serviceId, discount, quantity} = service
        const result = await this.repositoryEstimate.update({estimateId, clientId, itemId, serviceId}, 
          {
            discount, quantity,
            price : (commercial == false ? service.item.price: service.item.priceCommercial)
          }
        )
        resultUpdate += result.affected;
      }
      return resultUpdate
    }
  
    //Actualiza la direccion de los invoices
    async updateAddressEstimate(ests: Estimate[],pdfAddress:string) {
      if(!(ests.length > 0))
        return new HttpException("There is not invoices to update their direction", HttpStatus.BAD_REQUEST);
  
      let resultUpdate = 0;
      for(const est of ests){
        const {estimateId, clientId, itemId, serviceId} = est
        const result = await this.repositoryEstimate.update({estimateId, clientId, itemId, serviceId}, {...est, pdfAddress})
        resultUpdate += result.affected;
      }
      
      return resultUpdate;
    }
}
