
export class UpdateClientDto{
    name?: string
    address ?: string
    city?:string
    cp?:string
    country?:string
    phoneNumber?:string
    email?:string
    language?:string
    offerSended? : boolean;
    offerPdfAddress? : string;
    offerApproved? : boolean;
    maintenancePrice? : number;
    stabilizerPrice? : number;
    daysPerWeek? : string;
    commercial?:boolean
}