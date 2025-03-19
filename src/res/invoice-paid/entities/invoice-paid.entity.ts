import { InvoicePaidRelation } from "src/res/invoice-paid-relation/entities/invoice-paid-relation.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity({name: 'invoice_paid'})
export class InvoicePaid {

    @PrimaryColumn()
    paidDate: Date;

    @Column()
    months : number;

    @Column()
    paid : number;

    @OneToMany(()=> InvoicePaidRelation,  (paid) => paid.invoicePaid)
    invoicePaidRelations: InvoicePaidRelation[]
}

