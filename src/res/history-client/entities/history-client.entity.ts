import { Client } from "src/res/client/client.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name :'history_client'})
export class HistoryClient {
    @PrimaryColumn()
    clientId: number;

    @PrimaryColumn()
    date: Date;

    @Column()
    active:boolean;

    @Column({nullable :true})
    note?: string;

    @ManyToOne(()=> Client, client => client.histories)
    @JoinColumn({name:'clientId'})  
    client:Client
}
