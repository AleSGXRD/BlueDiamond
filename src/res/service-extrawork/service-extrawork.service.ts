import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ServiceExtrawork } from './entities/service-extrawork.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceExtraworkDto } from './dto/create-service-extrawork.dto';
import { UpdateServiceExtraworkDto } from './dto/update-service-extrawork.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceExtraworkService {
  constructor(@InjectRepository(ServiceExtrawork) private repositoryServiceExtrawork : Repository<ServiceExtrawork>) {    
  }
  async create(createServiceExtraworkDto: CreateServiceExtraworkDto) {
    const item = await this.repositoryServiceExtrawork.findOne({
      where: {
        clientId: createServiceExtraworkDto.clientId,
        itemId: createServiceExtraworkDto.itemId,
        serviceDate: createServiceExtraworkDto.date
      },
      relations: ['invoice_extrawork_item']
    });
    if(!item)
      return new HttpException("Item already exists", HttpStatus.NOT_FOUND);

    return this.repositoryServiceExtrawork.create(createServiceExtraworkDto);
  }

  findAll() {
    return this.repositoryServiceExtrawork.find();
  }

  async findOne(clientId: number,itemId : number,date : Date) {
    const item = await this.repositoryServiceExtrawork.findOne({
      where: {
        clientId: clientId,
        itemId: itemId,
        serviceDate: date
      },
      relations: ['invoice_extrawork_item']
    });
    if(!item)
      return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return item
  }

  async update(clientId: number,itemId:number,date : Date, updateServiceExtraworkDto: UpdateServiceExtraworkDto) {
    const item = await this.repositoryServiceExtrawork.findOne({
      where: {
        clientId: clientId,
        itemId: itemId,
        serviceDate: date
      }
    });
    if(!item)
      return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return this.repositoryServiceExtrawork.update({clientId, itemId, serviceDate:date}, updateServiceExtraworkDto);
  }

  async remove(clientId: number,itemId:number, date : Date) {
    const result = await this.repositoryServiceExtrawork.delete({clientId, itemId, serviceDate:date});
    if(result.affected === 0)
      return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return result
  }
}
