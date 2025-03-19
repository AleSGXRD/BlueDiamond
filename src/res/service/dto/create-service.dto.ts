export class CreateServiceDto {
    clientId:number;
    itemId:number;
    serviceId?:number;
    serviceDate:Date;
    manyMonths:number;
    permanent:boolean;
    active:boolean;
    estimateCreated:boolean;
    discount?:number;
    quantity:number;
}
