import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './res/client/client.module';
import { HistoryClientModule } from './res/history-client/history-client.module';
import { ServiceExtraworkModule } from './res/service-extrawork/service-extrawork.module';
import { ServiceExtraworkItemModule } from './res/service-extrawork-item/service-extrawork-item.module';
import { InvoicePaidModule } from './res/invoice-paid/invoice-paid.module';
import { RolModule } from './res/rol/rol.module';
import { UseraccountModule } from './res/useraccount/useraccount.module';
import { InvoiceModule } from './res/invoice/invoice.module';
import { ServiceItemModule } from './res/service-item/service-item.module';
import { Client } from './res/client/client.entity';
import { HistoryClient } from './res/history-client/entities/history-client.entity';
import { Invoice } from './res/invoice/entities/invoice.entity';
import { ServiceItem } from './res/service-item/service-item.entity';
import { InvoicePaid } from './res/invoice-paid/entities/invoice-paid.entity';
import { ServiceExtrawork } from './res/service-extrawork/entities/service-extrawork.entity';
import { ServiceExtraworkItem } from './res/service-extrawork-item/entities/service-extrawork-item.entity';
import { Rol } from './res/rol/entities/rol.entity';
import { Useraccount } from './res/useraccount/entities/useraccount.entity';
import { AuthModule } from './auth/auth.module';
import { PdfGeneratorModule } from './res/pdf-generator/pdf-generator.module';
import { ServiceModule } from './res/service/service.module';
import { Service } from './res/service/entities/service.entity';
import { ConfigModule } from '@nestjs/config';
import { SenderMailsService } from './logic/sender-mails/sender-mails.service';
import { InvoicePaidRelationModule } from './res/invoice-paid-relation/invoice-paid-relation.module';
import { InvoicePaidRelation } from './res/invoice-paid-relation/entities/invoice-paid-relation.entity';
import { GenerateInvoiceModule } from './res/generate-invoice/generate-invoice.module';
import { EstimateModule } from './res/estimate/estimate.module';
import { GenerateEstimateModule } from './res/generate-estimate/generate-estimate.module';
import { Estimate } from './res/estimate/entities/estimate.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el módulo esté disponible globalmente
      envFilePath:'.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT) ?? 3306,
      username: process.env.DATABASE_USERNAME ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      database: process.env.DATABASE ?? 'bluediamond',
      // entities : [__dirname + '/**/*.entity.{ts,js}'],
      entities: [Client,HistoryClient,Invoice,Service,ServiceItem,InvoicePaid,InvoicePaidRelation,ServiceExtrawork,ServiceExtraworkItem,Rol,Useraccount, Estimate],
      synchronize: false
    }),
    ServiceItemModule,
    ClientModule,
    HistoryClientModule,
    InvoiceModule,
    ServiceExtraworkModule,
    ServiceExtraworkItemModule,
    InvoicePaidModule,
    RolModule,
    UseraccountModule,
    AuthModule,
    PdfGeneratorModule,
    ServiceModule,
    InvoicePaidRelationModule,
    GenerateInvoiceModule,
    EstimateModule,
    GenerateEstimateModule,
  ],
  controllers: [],
  providers: [SenderMailsService],
})
export class AppModule {}
