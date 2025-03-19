import { Client } from "src/res/client/client.entity";
import { InvoicePaid } from "src/res/invoice-paid/entities/invoice-paid.entity";
import { Invoice } from "src/res/invoice/entities/invoice.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity({name : 'invoice_paid_relation'})
export class InvoicePaidRelation {
    @PrimaryColumn()
    paidDate: Date;

    @PrimaryColumn()
    invoiceId:number;

    @PrimaryColumn()
    serviceId : number;

    @PrimaryColumn()
    itemId: number;

    @PrimaryColumn()
    clientId:number;

    @ManyToOne(()=>Client, (client)=> client.invoicePaidRelations)
    @JoinColumn({ name : 'clientId' })
    client:Client

    @ManyToOne(()=>InvoicePaid, (invPaid)=> invPaid.invoicePaidRelations)
    @JoinColumn([{ name : 'paidDate', referencedColumnName:'paidDate' }])
    invoicePaid:InvoicePaid

    @OneToOne(()=> Invoice)
    @JoinColumn([{name: 'invoiceId', referencedColumnName:'invoiceId'},
        {name: 'clientId', referencedColumnName:'clientId'},
        {name: 'serviceId', referencedColumnName:'serviceId'},
        {name: 'itemId', referencedColumnName:'itemId'}
    ])
    invoice:Invoice
}
