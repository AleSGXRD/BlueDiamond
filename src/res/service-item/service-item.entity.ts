import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import cuid from 'cuid'
import { Invoice } from "../invoice/entities/invoice.entity"
import { Service } from "../service/entities/service.entity"

@Entity({name : 'service_item'})
export class ServiceItem{
    @PrimaryGeneratedColumn()
    itemId : number

    @Column({unique: true})
    name: string

    @Column()
    price:number

    @Column({nullable : true})
    priceCommercial:number
    
    @Column({nullable:true})
    description: string

    @OneToMany(()=> Service, service => service.item)
    services: Service[]
    @OneToMany(()=> Invoice, invoice => invoice.item)
    invoices: Invoice[]
}