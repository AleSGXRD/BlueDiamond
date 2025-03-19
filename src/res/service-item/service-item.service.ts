import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItem } from './service-item.entity';
import { Repository } from 'typeorm';
import { CreateServiceItemDto } from './dto/create-service-item.dto';
import { UpdateServiceItemDto } from './dto/update-service-item.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceItemService {

    /**
     *
     */
    constructor(@InjectRepository(ServiceItem) private ServiceItemRepository:Repository<ServiceItem>,
            private configService: ConfigService ) {
    }

    async getItems() : Promise<ServiceItem[]>{
        const items = await this.ServiceItemRepository.find();
        const idMonthlyService = this.configService.get<number>('MONTHLY_SERVICE_ID');
        return items.filter(item => item.itemId != idMonthlyService)
    }

    async getItem(itemId:number): Promise<ServiceItem | HttpException>{
        const userFounded = this.ServiceItemRepository.findOne({
            where: {
                itemId
            }
        })
        if(!userFounded)
            return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else 
            return userFounded
    }

    async createItem(ServiceItem:CreateServiceItemDto) : Promise<ServiceItem | HttpException>{

        const userFound = await this.ServiceItemRepository.findOne({
            where: {
                name: ServiceItem.name
            }
        })

        if(userFound){
            return new HttpException('Item already exists', HttpStatus.CONFLICT);
        }
        if(ServiceItem.priceCommercial == undefined){
            ServiceItem.priceCommercial = ServiceItem.price
        }

        const newServiceItem = this.ServiceItemRepository.create(ServiceItem);
        return this.ServiceItemRepository.save(newServiceItem);
    }

    async updateItem(itemId:number, ServiceItem:UpdateServiceItemDto){
        if(ServiceItem.priceCommercial == undefined){
            ServiceItem.priceCommercial = ServiceItem.price
        }
        
        const result = await this.ServiceItemRepository.update({ itemId }, ServiceItem)
        if(result.affected === 0)
            return new HttpException("Item don't found", HttpStatus.NOT_FOUND)

        return result
    }

    async deleteItem(itemId:number){
      const result = await this.ServiceItemRepository.delete({ itemId })
      if( result.affected == 0)
          return new HttpException("Item don't found", HttpStatus.NOT_FOUND)
      else
          return result
    }
}
