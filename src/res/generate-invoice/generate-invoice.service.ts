import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os'
import { Invoice } from 'src/res/invoice/entities/invoice.entity';
import { addMonths, eachMonthOfInterval, format, getMonth, getYear, isAfter, isBefore, setMonth, setYear } from 'date-fns';
import { Client } from 'src/res/client/client.entity';
import { InvoiceService } from 'src/res/invoice/invoice.service';
import { ConfigService } from '@nestjs/config';
import { ClientService } from '../client/client.service';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { Response } from 'express';
import { generateInvoiceTemplatePdf, generateLetterInformationTemplatePdf } from 'src/logic/pdf-templates';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../service/entities/service.entity';
import { MailResult } from 'src/types/MailResult';

@Injectable()
export class GenerateInvoiceService {
    constructor(private readonly invoiceService: InvoiceService,
            @InjectRepository(Service) private repositoryService : Repository<Service>,
            private readonly clientService: ClientService,
            private readonly configService: ConfigService,
            private readonly senderMailsService: SenderMailsService) {}

    async generateAllClientsInvoices(printPdf:boolean, sendPdf:boolean){
        const clients = await this.clientService.getItems();

        let mailsFailed:number = 0;
        let mailsSended:number = 0;
        for(const client of clients){
            if(await this.clientService.isActive(client) == false) continue;
            let serviceIds:any = new Set();

            for(const service of client.services){
                serviceIds.add(service.serviceId);
            }
            serviceIds = [...serviceIds];
    
            for(const service of serviceIds ){
                await this.generateInvoices(client,service);
                if(printPdf){
                    const result:any = await this.printPdfs(client.clientId,service, sendPdf);
                    if(sendPdf){
                        mailsFailed += result.mailsFailed;
                        mailsSended += result.mailsSended;
                        console.log(mailsFailed, mailsSended, result)
                    }
                }
            }
        }
        return { message:'Han sido enviados : ' + mailsSended + ' correos, y no han podido llegar : ' + mailsFailed + " correos"}
    }
    async generateAllInvoicesOfClient(client:Client,printPdf:boolean, sendPdf:boolean){
        if(await this.clientService.isActive(client) == false)
            throw new HttpException("Este cliente esta inactivo", HttpStatus.BAD_GATEWAY)
        let serviceIds:any = new Set();

        
        for(const service of client.services){
            serviceIds.add(service.serviceId);
        }
        serviceIds = [...serviceIds];

        let mailsFailed : number = 0;
        let mailsSended : number = 0;

        for(const service of serviceIds ){
            await this.generateInvoices(client,service);
            if(printPdf){
                const result : MailResult = await this.printPdfs(client.clientId,service, sendPdf);
                mailsFailed += result.mailsFailed;
                mailsSended += result.mailsSended;
                console.log(mailsFailed, mailsSended, result)
            }
        }
        return { message:'Han sido enviados : ' + mailsSended + ' correos, y no han podido llegar : ' + mailsFailed + " correos"}
    }
    async generateAllInvoicesOfClientOfOneService(client:Client, serviceId:number,printPdf:boolean, sendPdf:boolean){
        if(await this.clientService.isActive(client) == false)
            throw new HttpException("Este cliente esta inactivo", HttpStatus.BAD_GATEWAY)
        await this.generateInvoices(client,serviceId);

        if(printPdf)
            return await this.printPdfs(client.clientId,serviceId, sendPdf);
    }

    async generateInvoiceOfClientOfOneService(client:Client, serviceId:number,invoiceId:number,printPdf:boolean, sendPdf:boolean){
        if(await this.clientService.isActive(client) == false)
            throw new HttpException("Este cliente esta inactivo", HttpStatus.BAD_GATEWAY)
        
        if(printPdf)
            return await this.printPdf(client,serviceId,invoiceId, sendPdf);
    }


    async generateInvoices(client:Client, service: number){
         // Formateo las fechas
        let monthPaided: any = client.invoicePaidRelations.filter(paid =>paid.serviceId == service)
            .map(paid => ({month:format(paid.invoice.invoiceDate,'MMMM'), year: getYear(paid.invoice.invoiceDate)}))

        const serviceClient = client.services.filter(item => item.serviceId == service)
        
        const {permanent, manyMonths, active, serviceDate, finished} = serviceClient[0]
        if(active == false && finished == true)
            return 

        let isLimitedDate = false;
        let limitDate = new Date();
        if(permanent == false){
            const calculedDate = addMonths(serviceDate,manyMonths - 1);
            if(isBefore(calculedDate, limitDate) == true){
                limitDate = calculedDate;
                isLimitedDate = true;
            }
        }

        //Miro todos los meses que han pasado
        const monthsToPay = eachMonthOfInterval({
            start: new Date(serviceDate),
            end: limitDate,
        }).map(fecha => ({month:format(fecha, 'MMMM'), numberMonth: getMonth(fecha), numberYear: getYear(fecha)}));

        //Invoices del servicio actual
        let {invoices} = serviceClient[0];
        //Meses que faltan por pagar  
        let months = monthsToPay.filter(month => !monthPaided.find(paided => paided.month == month.month && paided.year == month.numberYear));      
        let invoiceMonths = [];
        
        if(invoices){
            for(const invoice of invoices){
                const month = getMonth( new Date(invoice.invoiceDate))
                const year = getYear(new Date(invoice.invoiceDate ))
                const {invoiceId} = invoice
                invoiceMonths.push({month, invoiceId, year});
            }
        }
        let allCreated = true;

        //Generar invoices que faltan
        for(const month of months){
            const invoiceExists = invoiceMonths.find(invoice => invoice.month == month.numberMonth && invoice.year == month.numberYear)
            if(invoiceExists) continue;
            allCreated = false;

            const modifiedDate =setYear(setMonth(new Date(), month.numberMonth), month.numberYear)
            const result = await this.invoiceService.generateInvoice(modifiedDate, serviceClient, client.commercial);
            invoices = [...invoices, ...result]
        }
        if(!allCreated && isLimitedDate){
            await this.repositoryService.update({serviceId: service}, {finished:true})
        }

    }
    async printPdfs(clientId:number, serviceId:number, sendPdf:boolean){
        let client = await this.clientService.getItem(clientId);
        let invoices = client.invoices.filter(invoice => invoice.serviceId == serviceId)
        let {serviceDate} = client.services.find(service => service.serviceId == serviceId)

        //Obtener todos los id de los invoices
        invoices = invoices.filter(inv => inv.paid == null);
        if(invoices.length == 0)
            return {message: "Este cliente ha pagado todos sus invoices",
                mailsFailed : 0,
                mailsSended : 0};

        let invoicesIds = [...new Set(invoices.map(value => value.invoiceId))];
        let invoicesInfo  = []
        
        //Imprimir cada invoice
        for(const id of invoicesIds){
            const invs = invoices.filter(value => value.invoiceId == id)
            const month = format(new Date(invs[0].invoiceDate), 'MMMM')
            const year = getYear(invs[0].invoiceDate)
            invoicesInfo.push({invs, month,year, id})
        }
        
        const pdfs = [...await this.generatePDF(client, invoicesInfo, serviceDate)];
        if(sendPdf == true){
            const result : MailResult = await this.senderMailsService.sendInvoices(pdfs,client);
            return result;
        }

        const result : MailResult ={ 
            message: 'Han sido generado :' + pdfs.length,
            mailsFailed : 0,
            mailsSended : 0
        };
        return result;
    }
 
    async printPdf(client:Client, serviceId: number,invoiceId:number, sendPdf:boolean){
        let invoices : Invoice[] = client.invoices.filter(invoice => invoice.serviceId == serviceId)
        let {serviceDate} = client.services.find(service => service.serviceId == serviceId)

        //Obtener todos los id de los invoices
        let invoicesInfo  = []
        //Imprimir cada invoice
        const invs = invoices.filter(value => value.invoiceId == invoiceId)
        
        const month = format(new Date(invs[0].invoiceDate), 'MMMM')
        const year = getYear(invs[0].invoiceDate)
        invoicesInfo.push({invs, month,year,id: invoiceId})
        const pdfs = [...await this.generatePDF(client, invoicesInfo, serviceDate)];
        if(sendPdf == true){
            const result : MailResult = await this.senderMailsService.sendInvoices(pdfs,client);
            return result;
        }
        const result : MailResult ={ 
            message: pdfs[0].filePath,
            mailsFailed : 0,
            mailsSended : 0
        };
        return result;
    }



    private savePath = this.configService.get<string>('PDF_SAVE_PATH') || './pdf-storage';

    async generatePDF(client: Client,toPrint: any,index : any): Promise<any[]>{
        // Iniciar Puppeteer
        if (!fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath, { recursive: true });
        }
        
        const folderPath = path.join(os.homedir(), `${this.savePath}${client.clientId} - ${client.name}/${format(index,'yyyy-MM-dd')}`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const result : any[] = client.commercial == true ? await this.generateInvoiceForCommercialPDF(client,toPrint, folderPath):  await this.generateInvoicePDF(client,toPrint,folderPath);
        
        return result;
    }
    async generateInvoiceForCommercialPDF(client: Client,invoices: any[], folderPath: string){
    // Ruta completa del archivo
    //invoice tiene invs, id, month
        let pdfs = [];
        for(const invoice of invoices){

            if (!fs.existsSync(path.join(folderPath, `${invoice.year}/${invoice.month}`))) {
                fs.mkdirSync(path.join(folderPath, `${invoice.year}/${invoice.month}`), { recursive: true });
            }
            const filePath = path.join(folderPath, `${invoice.year}/${invoice.month}/${client.clientId} INV-${invoice.id} ${client.name}.pdf`);

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            let amount= 0;
            for(const inv of invoice.invs){
            amount += (inv.quantity * inv.price) * ((100-inv.discount) / 100);
            }
            // Cargar contenido HTML
            const htmlContent = generateInvoiceTemplatePdf(client, invoice.invs, invoice.invs[0].invoiceDate, invoice.id, amount);
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
            // Generar PDF
            const pdfBuffer = await page.pdf({
                path: filePath,
                format: 'LETTER',
                printBackground: true,
            });
        
            await browser.close();//AQUI TENGO Q LLAMAR EL METODO PARA GUARDAR LA RUTA DLE INVOICE
            this.invoiceService.updateAddressInvoice(invoice.invs, filePath);
            pdfs.push({filePath, id : invoice.id, date : invoice.invs[0].invoiceDate});
        }

        return pdfs;
    }
    async generateInvoicePDF(client: Client,invoice: any[], folderPath:string){
        // Ruta completa del archivo
        const currentMonth = format(new Date(), 'MMMM');
        if (!fs.existsSync(path.join(folderPath, currentMonth))) {
            fs.mkdirSync(path.join(folderPath, currentMonth), { recursive: true });
        }

        //Preparar toda la informacion a imprimir
        let lastId = 0;
        let date =new Date();
        let invoiceInfoToPrint = []
        for(const item of invoice){
            if(item.id > lastId){
                lastId = item.id;
                date = item.invs[0].invoiceDate
            }

            for(const service of item.invs){
                const found = invoiceInfoToPrint.filter(value => value.itemId == service.itemId)
                if(found.length > 0){
                    let existsSameObject : boolean = false;
                    for(const element of found){
                        if(element.discount == service.discount && element.item.price == service.item.price){
                            element.quantity += service.quantity;
                            existsSameObject = true;
                            continue;
                        }
                        }
                        if(existsSameObject == false){
                            invoiceInfoToPrint.push({...service});
                    }
                }
                else
                    invoiceInfoToPrint.push({...service});
            }
        }
        const filePath = path.join(folderPath, `${currentMonth}/${client.clientId} INV-${lastId.toString().padStart(6,'0')} ${client.name}.pdf`);
        const filePathLetterInformation = path.join(folderPath, `${currentMonth}/CARTA DE INFORMACIÓN ${client.name}.pdf`);

        if(client.commercial == false && invoice.length > 1)
            await this.generateWarningInvoicePDF(client,lastId, invoice, filePathLetterInformation);
        else{
            if(fs.existsSync(filePathLetterInformation)){
                fs.unlink(filePathLetterInformation, (err) => {
                    if (err) {
                        console.error('Error eliminando el archivo:', err);
                    } else {
                        console.log(`Archivo ${filePathLetterInformation} eliminado con éxito`);
                    }
                });
            }
        }
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let amount= 0;
        for(const inv of invoiceInfoToPrint){
            amount += inv.quantity * inv.price * ((100-inv.discount) / 100);
        }

        // Cargar contenido HTML
        const htmlContent = generateInvoiceTemplatePdf(client, invoiceInfoToPrint, date, lastId, amount);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generar PDF
        const pdfBuffer = await page.pdf({
            path: filePath,
            format: 'LETTER',
            printBackground: true,
        });

        await browser.close();
        
        // Retornar la ruta del archivo generado
        return ([{filePath, filePathLetterInformation, id: lastId, date}]);
    }

    async generateWarningInvoicePDF(client:Client,lastId:number, invoice: any[], filePath:string){
        const mappedOldInvoices = invoice.map(value =>{
            return ({
                invoiceId : value.id,
                amount : this.calculeAllInvs(value.invs),
                month: value.month,
                year: value.year
            })
        })
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let amountTotal = 0;
        for(const invoices of mappedOldInvoices){
            amountTotal += invoices.amount;
        }

        let lastMonth = mappedOldInvoices.find(value => value.invoiceId == lastId).month

        // Cargar contenido HTML
        const htmlContent = generateLetterInformationTemplatePdf(client, mappedOldInvoices.filter(value => value.invoiceId != lastId), lastId, lastMonth, amountTotal);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generar PDF
        const pdfBuffer = await page.pdf({
            path: filePath,
            format: 'Letter',
            printBackground: true,
        });

        await browser.close();
    }
    calculeAllInvs(invoice:any[]){
        let amount =0;
        for(const inv of invoice){
            amount += (inv.price * inv.quantity) * ((100 - inv.discount)/100)
        }
        console.log('invoices: ', invoice)
        console.log('amount: ', amount)
        return amount
    }

//Muestra el pdf
    async viewPdf(invoiceId: number, res: Response) {
        try {
            // Construye la ruta completa al archivo
            const invoice = await this.invoiceService.findOne(invoiceId);
            if(!invoice)
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);

            let fullPath = invoice.pdfAddress;
            // Verifica si el archivo existe
            if (!fs.existsSync(fullPath)) {
                const client: Client  = await this.clientService.getItem(invoice.clientId);
                const path = await this.printPdf(client, invoice.serviceId, invoice.invoiceId, false );
                fullPath = path.message
            }

            // Establece los encabezados para mostrar el PDF en el navegador
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline'); // "inline" para mostrarlo en el navegador

            // Crea un stream de lectura del archivo y envíalo al cliente
            const fileStream = fs.createReadStream(fullPath);
            fileStream.pipe(res);
        } catch (error) {
            console.error(error);
            throw new HttpException('Error processing the file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
