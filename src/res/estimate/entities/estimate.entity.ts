import { Client } from "src/res/client/client.entity";
import { ServiceItem } from "src/res/service-item/service-item.entity";
import { Service } from "src/res/service/entities/service.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity('estimate')
export class Estimate {
    @PrimaryColumn()
    estimateId:number;

    @PrimaryColumn()
    clientId:number;

    @PrimaryColumn()
    itemId:number;

    @PrimaryColumn()
    serviceId:number;

    @Column()
    itemName : string;

    @Column()
    estimateDate:Date;
    
    @Column()
    estimateApproved:boolean;

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

    @ManyToOne(()=> Service, (service) => service.invoices)
    @JoinColumn([{name: 'clientId', referencedColumnName:'clientId'},
        {name: 'serviceId', referencedColumnName:'serviceId'},
        {name: 'itemId', referencedColumnName:'itemId'}
    ])
    service?: Service

}
