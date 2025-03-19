import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    quantity?: number;
    discount?: number;
    price?:number;
    pdfAddress?:string;
}
