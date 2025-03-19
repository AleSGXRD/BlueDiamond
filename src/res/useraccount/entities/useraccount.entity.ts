import { Rol } from "src/res/rol/entities/rol.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'useraccount'})
export class Useraccount {
    @PrimaryGeneratedColumn()
    userId:number

    @Column()
    rolId:number

    @Column()
    name:string

    @Column()
    password:string

    @OneToOne(()=> Rol)
    @JoinColumn({name:'rolId'})
    rol:Rol
}
