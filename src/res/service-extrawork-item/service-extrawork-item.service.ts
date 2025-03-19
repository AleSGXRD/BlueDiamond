import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceExtraworkItemDto } from './dto/create-service-extrawork-item.dto';
import { UpdateServiceExtraworkItemDto } from './dto/update-service-extrawork-item.dto';
import { ServiceExtraworkItem } from './entities/service-extrawork-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceExtraworkItemService {
  
    /**
     *
     */
    constructor(@InjectRepository(ServiceExtraworkItem) private ServiceExtraworkItemRepository:Repository<ServiceExtraworkItem> ) {
    }

    findAll() : Promise<ServiceExtraworkItem[]>{
        return this.ServiceExtraworkItemRepository.find();
    }

    async findOne(id:number): Promise<ServiceExtraworkItem | HttpException>{
        const userFounded = this.ServiceExtraworkItemRepository.findOne({
            where: {
                itemId:id
            }
        })
        if(!userFounded)
            return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else 
            return userFounded
    }

    async create(ServiceExtraworkItem:CreateServiceExtraworkItemDto) : Promise<ServiceExtraworkItem | HttpException>{

        const userFound = await this.ServiceExtraworkItemRepository.findOne({
            where: {
                name: ServiceExtraworkItem.name
            }
        })

        if(userFound){
            return new HttpException('Item already exists', HttpStatus.CONFLICT);
        }
        if(ServiceExtraworkItem.priceCommercial == undefined){
            ServiceExtraworkItem.priceCommercial = ServiceExtraworkItem.price
        }

        const newServiceExtraworkItem = this.ServiceExtraworkItemRepository.create(ServiceExtraworkItem);
        return this.ServiceExtraworkItemRepository.save(newServiceExtraworkItem);
    }

    async update(id:number, ServiceExtraworkItem:UpdateServiceExtraworkItemDto){
        if(ServiceExtraworkItem.priceCommercial == undefined){
            ServiceExtraworkItem.priceCommercial = ServiceExtraworkItem.price
        }
        
        const result = await this.ServiceExtraworkItemRepository.update({ itemId:id }, ServiceExtraworkItem)
        if(result.affected === 0)
            return new HttpException("Item don't found", HttpStatus.NOT_FOUND)

        return result
    }

    async remove(id:number){
      const result = await this.ServiceExtraworkItemRepository.delete({ itemId:id })
      if( result.affected == 0)
          return new HttpException("Item don't found", HttpStatus.NOT_FOUND)
      else
          return result
    }
}
