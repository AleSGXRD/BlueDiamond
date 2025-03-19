import { Client } from "src/res/client/client.entity";
import { ServiceItem } from "src/res/service-item/service-item.entity";
import { InvoicePaid } from "src/res/invoice-paid/entities/invoice-paid.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Service } from "src/res/service/entities/service.entity";
import { InvoicePaidRelation } from "src/res/invoice-paid-relation/entities/invoice-paid-relation.entity";

@Entity({name:'invoice'})
export class Invoice {
    @PrimaryColumn()
    invoiceId:number;

    @PrimaryColumn()
    clientId:number;

    @PrimaryColumn()
    itemId:number;

    @PrimaryColumn()
    serviceId:number;

    @Column()
    itemName : string;

    @Column()
    invoiceDate:Date;

    @Column({nullable:true})
    discount:number;

    @Column()
    quantity:number;

    @Column()
    price:number;

    @Column({nullable : true})
    pdfAddress?:string;

    @ManyToOne(()=>Client, (client)=> client.invoices)
    @JoinColumn({ name : 'clientId' })
    client?:Client

    @ManyToOne(()=>ServiceItem, (item)=> item.invoices)
    @JoinColumn({ name : 'itemId' })
    item?:ServiceItem

    @ManyToOne(()=> Service, (service) => service.invoices)
    @OneToOne(()=> InvoicePaidRelation)
    @JoinColumn([{name: 'clientId', referencedColumnName:'clientId'},
        {name: 'serviceId', referencedColumnName:'serviceId'},
        {name: 'itemId', referencedColumnName:'itemId'}
    ])
    service?: Service

    @OneToOne(()=> InvoicePaidRelation)
    @JoinColumn([{name: 'invoiceId', referencedColumnName:'invoiceId'},
        {name: 'clientId', referencedColumnName:'clientId'},
        {name: 'serviceId', referencedColumnName:'serviceId'},
        {name: 'itemId', referencedColumnName:'itemId'}
    ])
    paid?: InvoicePaidRelation
}
