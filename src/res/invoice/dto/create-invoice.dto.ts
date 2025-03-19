export class CreateInvoiceDto {
    invoiceId:number;
    clientId:number;
    itemId:number;
    itemName:string;
    serviceId:number;
    invoiceDate:Date;
    discount?:number;
    quantity:number;
    price:number;
    pdfAddress?:string;
}
