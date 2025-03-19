import { Client } from "src/res/client/client.entity";
import { Invoice } from "src/res/invoice/entities/invoice.entity";
import { ServiceItem } from "src/res/service-item/service-item.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity({name : 'service'})
export class Service {
    @PrimaryColumn()
    clientId:number;
    @PrimaryColumn()
    itemId:number;
    @PrimaryColumn()
    serviceId:number;

    @Column()
    serviceDate:Date;
    @Column()
    manyMonths:number;
    @Column()
    permanent:boolean;
    @Column()
    estimateCreated:boolean;
    @Column()
    active:boolean;
    @Column()
    finished:boolean;
    @Column({nullable:true})
    discount:number;
    @Column()
    quantity:number;

    @ManyToOne(()=>Client, (client)=> client.services)
    @JoinColumn({ name : 'clientId' })
    client?:Client

    @ManyToOne(()=> ServiceItem, (serviceItem) => serviceItem.services)
    @JoinColumn({name : 'itemId'})
    item?: ServiceItem

    @OneToMany(()=> Invoice,  (invoice) => invoice.service)
    invoices?: Invoice[]

}
