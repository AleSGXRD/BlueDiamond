import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Estimate } from '../estimate/entities/estimate.entity';
import { ClientService } from '../client/client.service';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private repositoryService : Repository<Service>,
              @InjectRepository(Estimate) private repositoryEstimate : Repository<Estimate>,
            private configService : ConfigService) {    
  }
  private monthlyServiceId = this.configService.get<number>("MONTHLY_SERVICE_ID")
  async create(createServiceDto: CreateServiceDto[]) {

    const {clientId} = createServiceDto[0];

    // if(await this.clientService.isActiveById(clientId) == false)
    //   throw new HttpException("Este cliente esta inactivo", HttpStatus.BAD_GATEWAY)

    const serviceId = await this.getLastId(clientId);
    const item = await this.repositoryService.findOne({
      where: {
        clientId,
        serviceId,
      }
    });
    if(item)
      throw new HttpException("Item already exists", HttpStatus.CONFLICT)
    let saved = [];

    for(const createService of createServiceDto){
      const newService = this.repositoryService.create({serviceId,...createService});
      saved.push(await this.repositoryService.save(newService))
    }
    return saved;
  }

  findAll() {
    return this.repositoryService.find({
      relations: ['item','client']
    });
  }

  async findOne(clientId: number,itemId : number,serviceId : number) {
    const item = await this.repositoryService.findOne({
      where: {
        clientId,
        itemId,
        serviceId
      },
      relations: ['item', 'invoices']
    });
    if(!item)
      throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
    
    return item
  }
  async findMonthlyService(clientId: number){
    const item = await this.repositoryService.findOne({
      where: {
        clientId,
        itemId: this.monthlyServiceId
      }
    })
    if(!item)
      return undefined;

    return item;
  }
  async getLastId(clientId:number){
      const items = (await this.repositoryService.find()).filter(service => service.clientId == clientId).sort((a,b)=> b.serviceId - a.serviceId);
      if(items.length == 0)
          return 0;
      
      return items[0].serviceId + 1;
  }
  

  async update(updateServiceDto: UpdateServiceDto[]) {
    if(updateServiceDto && updateServiceDto.length == 0)
      throw new HttpException("No hay servicios para actualizar.", HttpStatus.BAD_REQUEST);
    
    const { clientId, serviceId, active, estimateCreated } = updateServiceDto[0];
    if(active && estimateCreated){
      const estimateFound = await this.repositoryEstimate.findOne({
        where:{
          serviceId,
          clientId
        }
      }
      );
      if(estimateFound)
        if(estimateFound.estimateApproved == false){
            await this.repositoryEstimate.update({
              estimateId: estimateFound.estimateId
            },
            {estimateApproved:true}
          )
        }
    }

    let update = 0, added = 0, deleted = 0;
    const items = (await this.repositoryService.find({
      where:{
        clientId
      }
    })).filter(service => serviceId == service.serviceId)
    const itemIds = items.map((value)=> value.itemId);
    const serviceUpdateIds = updateServiceDto.map((value)=> value.itemId);

    for(const updateService of updateServiceDto){
      const {clientId, itemId, serviceId, serviceDate, manyMonths, permanent, active,finished,discount, quantity} = updateService
      const updateItem ={clientId, itemId, serviceId, serviceDate, manyMonths, permanent, active, finished,discount, quantity}
      if(itemIds.includes(updateService.itemId)){
        const result = await this.repositoryService.update({clientId, itemId: updateService.itemId,serviceId }, updateItem);
        update += result.affected
      }
      else{
        const create = this.repositoryService.create(updateItem);
        const saved = await this.repositoryService.save(create);
        if(saved)
          added += 1;
      }
    }

    let itemsOut = []
    for(const id of itemIds){
      if(serviceUpdateIds.includes(id) == false)
        itemsOut.push(id)
    }

    if(itemsOut.length > 0){
      for(const idOut of itemsOut){
        const result = await this.removeItem(clientId, serviceId, idOut);
        if(result.affected > 0)
          deleted +=1;
      }
    }
    const data ={
      message : `Fueron actualizados ${update}, añadido ${added} y eliminados ${deleted} items del servicio,`
    }

    return data;
  }

  async remove(clientId: number, serviceId : number) {
    const services = await this.repositoryService.find();
    if(services.length ==0)
      throw new HttpException("There's no item to delete", HttpStatus.BAD_REQUEST);

    const result = await this.repositoryService.delete({serviceId, clientId});
    return result;
  }
  async removeItem(clientId: number, serviceId : number, itemId:number) {
    const services = await this.repositoryService.find();
    if(services.length ==0)
      throw new HttpException("There's no item to delete", HttpStatus.BAD_REQUEST);

    const result = await this.repositoryService.delete({serviceId, clientId, itemId});
    return result;
  }
}
