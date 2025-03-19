import { Client } from "src/res/client/client.entity";

export interface InvoiceToPrint{
    service: any,
    months: any[],
    client: Client
}