import { Client } from "src/res/client/client.entity";
import { ServiceExtraworkItem } from "src/res/service-extrawork-item/entities/service-extrawork-item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name: 'service_extrawork'})
export class ServiceExtrawork {
    @PrimaryColumn()
    clientId:number;
    @PrimaryColumn()
    itemId:number;
    @PrimaryColumn()
    serviceDate:Date;
    @Column({nullable:true})
    datepaided:Date;
    @Column({nullable:true})
    discount:number;
    @Column()
    quantity:number;

    @ManyToOne(()=>Client, (client)=> client.servicesExtrawork)
    @JoinColumn({ name : 'clientId' })
    client:Client

    @ManyToOne(()=> ServiceExtraworkItem, item => item.invoices)
    @JoinColumn({ name : 'itemId' })
    item:ServiceExtraworkItem;
}
