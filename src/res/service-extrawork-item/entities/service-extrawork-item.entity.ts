import {  ServiceExtrawork } from "src/res/service-extrawork/entities/service-extrawork.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'service_extrawork_item'})
export class ServiceExtraworkItem {

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

    @OneToMany(()=> ServiceExtrawork, service =>service.item)
    invoices: ServiceExtrawork[]
}
