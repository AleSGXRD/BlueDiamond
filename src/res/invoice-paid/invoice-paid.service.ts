import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoicePaidDto } from './dto/create-invoice-paid.dto';
import { UpdateInvoicePaidDto } from './dto/update-invoice-paid.dto';
import { InvoicePaid } from './entities/invoice-paid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../invoice/entities/invoice.entity';
import compareDates from 'src/logic/date-manager';
import { InvoicePaidRelationService } from '../invoice-paid-relation/invoice-paid-relation.service';
import { CreateInvoicePaidRelationDto } from '../invoice-paid-relation/dto/create-invoice-paid-relation.dto';

@Injectable()
export class InvoicePaidService {
  
    /**
     *
     */
    constructor(@InjectRepository(InvoicePaid) private InvoicePaidRepository:Repository<InvoicePaid>,
                private InvoicePaidRelationService: InvoicePaidRelationService) {
    }

    findAll() : Promise<InvoicePaid[]>{
        return this.InvoicePaidRepository.find();
    }

    async findOne(paidDate:Date): Promise<InvoicePaid[] | HttpException>{
        const itemFound = this.InvoicePaidRepository.find({
            where: {
                paidDate
            }
        })
        if(!itemFound)
            throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else 
            return itemFound
    }

    async create(InvoicePaid:CreateInvoicePaidDto) : Promise<any | HttpException>{

        const itemFound = await this.InvoicePaidRepository.findOne({
            where: {
              paidDate: InvoicePaid.paidDate,
            }
        })
        if(itemFound){
          throw new HttpException('Item already exists', HttpStatus.CONFLICT);
        }
        if(InvoicePaid.invoices.length == 0){
          throw new HttpException('Must have Invoices to pay', HttpStatus.BAD_REQUEST);
        }
        const newInvoicePaid = this.InvoicePaidRepository.create(InvoicePaid);
        const savedInvoicePaid = await this.InvoicePaidRepository.save(newInvoicePaid);

        let results = []

        for(const invoice of InvoicePaid.invoices){
          const result = await this.InvoicePaidRelationService.create({...invoice, paidDate: savedInvoicePaid.paidDate});
          results.push(result)
        }

        const data = {
          savedInvoicePaid,
          results
        }
        return data;
    }

    async update(paidDate:Date, InvoicePaid:UpdateInvoicePaidDto){
        const result = await this.InvoicePaidRepository.update({ paidDate }, InvoicePaid)
        if(result.affected === 0)
            throw new HttpException("Item don't found", HttpStatus.NOT_FOUND)

        return result
    }

    async remove(paidDate:Date){
      const datePaid = await this.InvoicePaidRepository.find({where:{paidDate}})
      const toDelete = datePaid.filter(paid => compareDates(paidDate, paid.paidDate))
      if(toDelete.length ==0){
        throw new HttpException("Item don't found", HttpStatus.NOT_FOUND)
      }
      const result = await this.InvoicePaidRepository.delete({  paidDate: toDelete[0].paidDate, })
      return result
    }
}
