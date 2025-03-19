export class CreateEstimateDto {
    estimateId:number;
    clientId:number;
    itemId:number;
    serviceId:number;
    itemName:string;
    estimateDate:Date;
    estimateApproved:boolean;
    discount?:number;
    quantity:number;
    price:number;
    pdfAddress?:string;
}
