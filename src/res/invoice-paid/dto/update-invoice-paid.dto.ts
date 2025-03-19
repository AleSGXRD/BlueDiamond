import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoicePaidDto } from './create-invoice-paid.dto';

export class UpdateInvoicePaidDto extends PartialType(CreateInvoicePaidDto) {
    months?:number;
    paid?:number;
}
