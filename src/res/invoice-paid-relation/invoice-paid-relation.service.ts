import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoicePaidRelationDto } from './dto/create-invoice-paid-relation.dto';
import { UpdateInvoicePaidRelationDto } from './dto/update-invoice-paid-relation.dto';
import { InvoicePaidRelation } from './entities/invoice-paid-relation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../invoice/entities/invoice.entity';
import compareDates from 'src/logic/date-manager';
import { isEqual } from 'date-fns';

@Injectable()
export class InvoicePaidRelationService {
  
      /**
       *
       */
      constructor(@InjectRepository(InvoicePaidRelation) private InvoicePaidRelationRepository:Repository<InvoicePaidRelation>,
                   @InjectRepository(Invoice) private readonly InvoiceRepository:Repository<Invoice>) {
      }
  
      findAll() : Promise<InvoicePaidRelation[]>{
          return this.InvoicePaidRelationRepository.find();
      }
  
      async findOne(paidDate:Date,serviceId:number, clientId:number): Promise<InvoicePaidRelation[] | HttpException>{
          const itemFounded = this.InvoicePaidRelationRepository.find({
              where: {
                  paidDate,
                  serviceId,
                  clientId
              }
          })
          if(!itemFounded)
              throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
          else 
              return itemFounded
      }
  
      async create(InvoicePaidRelation:CreateInvoicePaidRelationDto) : Promise<any | HttpException>{
  
          const itemFound = await this.InvoicePaidRelationRepository.findOne({
              where: {
                invoiceId: InvoicePaidRelation.invoiceId,
                serviceId: InvoicePaidRelation.serviceId,
                clientId: InvoicePaidRelation.clientId,
              }
          })
          if(itemFound){
              throw new HttpException('Item already exists', HttpStatus.CONFLICT);
          }
          console.log(InvoicePaidRelation.paidDate);
          const items = (await this.InvoiceRepository.find()).filter(invoice => {
            return invoice.invoiceId == InvoicePaidRelation.invoiceId && invoice.clientId == InvoicePaidRelation.clientId && invoice.serviceId == InvoicePaidRelation.serviceId;
          })
          console.log(items);
          let many = 0;
          let itemsAdded = [];
          for(const item of items){
            const paid = {...InvoicePaidRelation, itemId: item.itemId}
            const newInvoicePaidRelation = this.InvoicePaidRelationRepository.create(paid);
            const savedInvoicePaidRelation = await this.InvoicePaidRelationRepository.save(newInvoicePaidRelation);
            if(savedInvoicePaidRelation){
              many +=1;
              itemsAdded.push(savedInvoicePaidRelation)
            }
            else
              throw new HttpException("Error to add the paid of date :"+ item.serviceId + " client: "+ item.clientId + " item: " + item.itemId, HttpStatus.CONFLICT)
          }
  
          const data = {
            message : 'Has been added ' + many,
            itemsAdded
          }
          console.log('data', data);
  
          return data;
      }
  
      async update(paidDate:Date,serviceId:number, clientId:number, InvoicePaidRelation:UpdateInvoicePaidRelationDto){
          const result = await this.InvoicePaidRelationRepository.update({ paidDate,serviceId,clientId }, InvoicePaidRelation)
          if(result.affected === 0)
              throw new HttpException("Item don't found", HttpStatus.NOT_FOUND)
  
          return result
      }
  
      async remove(paidDate:Date,serviceId:number, clientId:number){
        const datePaid = await this.InvoicePaidRelationRepository.find({where:{clientId}})
        const toDelete = datePaid.filter(paid => isEqual(paidDate, paid.paidDate) && paid.serviceId == serviceId)
        if(toDelete.length ==0){
          throw new HttpException("Item don't found", HttpStatus.NOT_FOUND)
        }
        const result = await this.InvoicePaidRelationRepository.delete({  paidDate: toDelete[0].paidDate,serviceId:toDelete[0].serviceId,clientId  })
        return result
      }
}
