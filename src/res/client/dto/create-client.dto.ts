import { CreateHistoryClientDto } from "src/res/history-client/dto/create-history-client.dto";

export class CreateClientWithHistoryDto{
    client : CreateClientDto;
    history : CreateHistoryClientDto
}
export class CreateClientDto{
    name: string;
    address ?: string;
    city?:string;
    cp?:string;
    country?:string;
    phoneNumber?:string;
    email:string;
    language?:string;
    offerSended? : boolean;
    offerPdfAddress? : string;
    offerApproved? : boolean;
    stabilizerPrice : number;
    maintenancePrice : number;
    daysPerWeek : string;
    commercial:boolean;
}