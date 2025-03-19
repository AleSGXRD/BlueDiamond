import { Useraccount } from "src/res/useraccount/entities/useraccount.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'rol'})
export class Rol {
    @PrimaryGeneratedColumn()
    rolId:number
    @Column({unique:true})
    name:string
}
