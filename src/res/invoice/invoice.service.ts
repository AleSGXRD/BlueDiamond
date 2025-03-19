import { HttpException, HttpStatus, Injectable, Query, Res } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { ClientService } from '../client/client.service';
import { Client } from '../client/client.entity';
import { GenerateInvoiceService } from '../generate-invoice/generate-invoice.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InvoiceService {
  constructor(@InjectRepository(Invoice) private repositoryInvoice : Repository<Invoice>,
      @InjectRepository(Client) private clientRepository : Repository<Client>,
      private configService: ConfigService) {}

  private monthlyServiceId = this.configService.get<number>('MONTHLY_SERVICE_ID')
  private stabilizerId = this.configService.get<number>('STABILIZER_ID')

  async getLastId(){
      const items = (await this.repositoryInvoice.find()).sort((a,b)=> b.invoiceId - a.invoiceId);
      if(items.length == 0)
          return 0;
      
      return items[0].invoiceId + 1;
  }
  
  async create(createInvoiceDto: CreateInvoiceDto) {
    const item = await this.repositoryInvoice.findOne({
      where: {
        clientId: createInvoiceDto.clientId,
        itemId: createInvoiceDto.itemId,
        serviceId: createInvoiceDto.serviceId
      }
    });
    if(item)
      return new HttpException("Item already exists", HttpStatus.CONFLICT)
    const newInvoice = this.repositoryInvoice.create(createInvoiceDto);
    return this.repositoryInvoice.save(newInvoice);
  }

  async generateInvoice(invoiceDate : Date, services :any[], commercial:boolean){
      const invoiceId = (await this.getLastId());
      let invoicesSaved = [];
      for(const service of services){
        let price = (commercial == false ? service.item.price: service.item.priceCommercial);
        if(service.itemId == this.monthlyServiceId){
          const client = await this.clientRepository.findOne({where:{clientId: service.clientId}})
          price = client.maintenancePrice
        }
        if(service.itemId == this.stabilizerId){
          const client = await this.clientRepository.findOne({where:{clientId: service.clientId}})
          price = client.stabilizerPrice
        }
        const invoice: CreateInvoiceDto = {
            invoiceId,
            clientId: service.clientId,
            itemId: service.itemId,
            itemName: service.item.name,
            serviceId: service.serviceId,
            invoiceDate,
            discount : service.discount,
            quantity : service.quantity,
            price : price
        }
        const result = await this.addInvoice(invoice)
        invoicesSaved.push(result)
      }
      return invoicesSaved
  }

  async addInvoice(invoice: CreateInvoiceDto){
      if(invoice.clientId == undefined){
          invoice.clientId = (await this.getLastId());
      }
      const createdInvoice = this.repositoryInvoice.create(invoice);
      const saveInvoice = await this.repositoryInvoice.save(createdInvoice);
      return saveInvoice;
  }

  findAll() {
    return this.repositoryInvoice.find({
      relations: ['service', 'paid']
    });
  }

  async findOne(invoiceId:number) {
    const item = await this.repositoryInvoice.findOne({
      where: {
        invoiceId
      },
      relations: ['service', 'paid']
    });
    if(!item)
      throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
    
    return item
  }

  async update(invoiceId:number,clientId: number,itemId:number,serviceId : number, updateInvoiceDto: UpdateInvoiceDto) {
    const item = await this.repositoryInvoice.findOne({
      where: {
        invoiceId,
        clientId: clientId,
        itemId: itemId,
        serviceId: serviceId
      }
    });
    if(!item)
      return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return this.repositoryInvoice.update({invoiceId,clientId, itemId, serviceId}, updateInvoiceDto);
  }

  async remove(invoiceId: number) {
    const result = await this.repositoryInvoice.delete({invoiceId});
    if(result.affected === 0)
      return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return result;
  }

  //Actualiza la direccion de los invoices
  async updateAddressInvoice(invs: Invoice[],pdfAddress:string) {
    if(!(invs.length > 0))
      return new HttpException("There is not invoices to update their direction", HttpStatus.BAD_REQUEST);

    let resultUpdate = 0;
    for(const inv of invs){
      const {invoiceId, clientId, itemId, serviceId} = inv
      const result = await this.repositoryInvoice.update({invoiceId, clientId, itemId, serviceId}, {...inv, pdfAddress})
      resultUpdate += result.affected;
    }
    
    return resultUpdate;
  }

}
