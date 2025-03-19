import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import { HistoryClient } from "../history-client/entities/history-client.entity"
import { Invoice } from "../invoice/entities/invoice.entity"
import { ServiceExtrawork } from "../service-extrawork/entities/service-extrawork.entity"
import { InvoicePaid } from "../invoice-paid/entities/invoice-paid.entity"
import { Service } from "../service/entities/service.entity"
import { InvoicePaidRelation } from "../invoice-paid-relation/entities/invoice-paid-relation.entity"
import { Estimate } from "../estimate/entities/estimate.entity"

@Entity({name : 'client'})
export class Client{

    @PrimaryGeneratedColumn()
    clientId : number

    @Column()
    name: string

    @Column({nullable:true})
    address : string

    @Column({nullable:true})
    city:string

    @Column({nullable:true})
    cp:string

    @Column({nullable:true})
    country:string

    @Column({nullable:true})
    phoneNumber:string

    @Column({nullable:true, unique:true})
    email:string

    @Column({nullable:true})
    language:string

    @Column({default : false})
    offerSended? : boolean

    @Column()
    offerPdfAddress? : string;

    @Column()
    offerApproved? : boolean;

    @Column()
    maintenancePrice : number;

    @Column()
    stabilizerPrice : number;

    @Column()
    daysPerWeek : string;

    @Column({nullable:true})
    commercial:boolean

    @OneToMany(()=> HistoryClient,  (history) => history.client)
    histories: HistoryClient[]

    @OneToMany(()=> Invoice,  (invoice) => invoice.client)
    invoices: Invoice[]

    @OneToMany(()=> Service,  (service) => service.client)
    services: Service[]

    @OneToMany(()=> Estimate,  (estimate) => estimate.client)
    estimates: Estimate[]

    @OneToMany(()=> InvoicePaidRelation,  (paid) => paid.client)
    invoicePaidRelations: InvoicePaidRelation[]

    @OneToMany(()=>ServiceExtrawork ,  (extrawork) => extrawork.client)
    servicesExtrawork: ServiceExtrawork[]
}