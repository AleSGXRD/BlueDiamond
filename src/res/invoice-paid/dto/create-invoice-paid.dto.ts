import { CreateInvoicePaidRelationDto } from "src/res/invoice-paid-relation/dto/create-invoice-paid-relation.dto";

export class CreateInvoicePaidDto {
    paidDate:Date;
    months:number;
    paid:number;
    invoices:CreateInvoicePaidRelationDto[];
}
