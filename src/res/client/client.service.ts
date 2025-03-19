import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryClientDto } from '../history-client/dto/create-history-client.dto';
import { HistoryClientService } from '../history-client/history-client.service';
import { HistoryClient } from '../history-client/entities/history-client.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { InvoiceService } from '../invoice/invoice.service';
import { MONTHLY_SERVICE_NAME } from 'src/constants/monthly-service';
import { Service } from '../service/entities/service.entity';
import { CreateServiceDto } from '../service/dto/create-service.dto';
import { Response } from 'express';
import puppeteer from 'puppeteer';
import compareDates from 'src/logic/date-manager';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { generateServiceOfferCommercialTemplatePdf, generateServiceOfferEngTemplatePdf, generateServiceOfferEspTemplatePdf } from 'src/logic/pdf-templates';
import { ServiceService } from '../service/service.service';

@Injectable()
export class ClientService {
    constructor(private historyService: HistoryClientService,
        @InjectRepository(Client) private ClientRepository:Repository<Client>,
        private serviceService: ServiceService,
        private configService:ConfigService,
        private senderMailsService: SenderMailsService
    ) {
    }
    private monthlyServiceId = this.configService.get<number>('MONTHLY_SERVICE_ID');
    private monthlyServiceName = MONTHLY_SERVICE_NAME;

    getItems() : Promise<Client[]>{
        return this.ClientRepository.find({relations:['histories','invoices','invoices.item','invoices.paid','estimates','services','services.item','services.invoices','services.invoices.paid','services.invoices.paid.invoicePaid','services.invoices.item','servicesExtrawork','invoicePaidRelations','invoicePaidRelations.invoicePaid', 'invoicePaidRelations.invoice']});
    }
    

    async getItem(id:number): Promise<Client>{
        const userFounded = await this.ClientRepository.findOne({
            where: {
                clientId:id
            },
            relations:['histories','invoices','invoices.item','invoices.paid','estimates','services','services.item','services.invoices','services.invoices.paid','services.invoices.paid.invoicePaid','services.invoices.item','servicesExtrawork','invoicePaidRelations','invoicePaidRelations.invoicePaid', 'invoicePaidRelations.invoice']
        })
        if(!userFounded)
            throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

        return userFounded
    }

    async createItem(Client:CreateClientDto, history:CreateHistoryClientDto) : Promise<any | HttpException>{
        const userFound = await this.ClientRepository.findOne({
            where: {
                name: Client.name
            }
        })

        if(userFound){
            throw new HttpException('Item already exists', HttpStatus.CONFLICT);
        }

        const newClient = this.ClientRepository.create(Client);
        const savedClient = await this.ClientRepository.save(newClient);

        history.clientId = savedClient.clientId;
        const newHistory = this.historyService.createHistory(history);
        
        if(savedClient.offerApproved == true){
            const service : CreateServiceDto = {
                clientId : savedClient.clientId,
                itemId: this.monthlyServiceId,
                serviceDate: history.date,
                permanent:true,
                
                quantity:1,
                manyMonths:0,
                discount: 0,
                active:savedClient.offerApproved,
                estimateCreated: true,
            }
            const savedService = await this.serviceService.create([service]);
        }
        const data = {
            client : savedClient,
            history: newHistory,
        }
        return data
    }

    async updateItem(id:number, Client:UpdateClientDto){
        const userFounded = await this.ClientRepository.findOne({
            where: {
                clientId:id
            }
        })
        if(!userFounded)
            throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

        const {offerApproved} = Client;
        if(offerApproved != undefined && offerApproved != userFounded.offerApproved){
            const monthlyService = await this.serviceService.findMonthlyService(id);
            if(monthlyService != undefined){
                const updateService = await this.serviceService.update([{...monthlyService, active : offerApproved}])
                console.log(updateService);
            }
            else{
                if(offerApproved == true){
                    const service : CreateServiceDto = {
                        clientId : id,
                        itemId: this.monthlyServiceId,
                        serviceDate: new Date(),
                        permanent:true,
                        
                        quantity:1,
                        manyMonths:0,
                        discount: 0,
                        active:true,
                        estimateCreated: true,
                    }
                    const savedService = await this.serviceService.create([service]);
                }
            }
        }

        return this.ClientRepository.update({ clientId : id }, Client)
    }

    async deleteItem(id:number){
        const result = await this.ClientRepository.delete({ clientId: id })
        if( result.affected == 0)
            throw new HttpException("Item don't found", HttpStatus.NOT_FOUND)
        else
            return result
    }
    async approveOffer(id:number){
        const client = await this.getItem(id);

        const updateClient : UpdateClientDto = {offerApproved : true}
        const updatedClient = await this.ClientRepository.update({clientId : id},updateClient )

        const serviceExists = client.services.find(service => service.itemId == this.monthlyServiceId);
        console.log(this.monthlyServiceId, serviceExists)
        if(serviceExists){
            const updateService = await this.serviceService.update([{...serviceExists, active:true}])
            if(updateService.message){
                const data = {
                    message : "Ha sido aprobado el servicio mensual del cliente"
                }
                return data
            }
        }

        const service : CreateServiceDto = {
            clientId : client.clientId,
            itemId: this.monthlyServiceId,
            serviceDate: new Date(),
            permanent:true,
            
            quantity:1,
            manyMonths:0,
            discount: 0,
            active:true,
            estimateCreated: true,
        }
        const savedService = await this.serviceService.create([service]);
        if(updatedClient && savedService){
            const data = {
                message : "Ha sido aprobado el servicio mensual del cliente"
            }
            return data
        }
        else
            throw new HttpException("Ha ocurrido un error al intentar actualizar el servicio mensaul", HttpStatus.BAD_REQUEST);
    }
    async isActive(client:Client){
        const history = await this.historyService.lastEntrance(client.clientId);
        return history.active
    }
    async isActiveById(clientId:number){
        const history = await this.historyService.lastEntrance(clientId);
        return history.active
    }
    async sendOffer(id:number, send:boolean){
        const client = await this.getItem(id);

        return this.generatePDF(client, send);
    }
    private savePath = this.configService.get<string>('PDF_SAVE_PATH') || './pdf-storage';
    async generatePDF(client: Client, send:boolean): Promise<any>{
        // Iniciar Puppeteer
        if (!fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath, { recursive: true });
        }
        
        const folderPath = path.join(os.homedir(), `${this.savePath}${client.clientId} - ${client.name}/SERVICES OFFER`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const result : any =await this.generateServicesOffer(client,folderPath, send);
        
        console.log(result);
        return result;
        
    }
    async generateServicesOffer(client: Client, folderPath: string,send:boolean){
        // Ruta completa del archivo
        //invoice tiene invs, id, month

        let pdfs = [];
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const filePath = path.join(folderPath, `${client.clientId} SERVICES OFFER ${client.name}.pdf`);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const amount = client.maintenancePrice;
        const stabilizer = client.stabilizerPrice;
        const daysPerWeek = client.daysPerWeek

        // Cargar contenido HTML
        const htmlContent = client.commercial == false ?
                                (client.language == "Español" ? generateServiceOfferEspTemplatePdf(client, amount,stabilizer,daysPerWeek, this.monthlyServiceId, this.monthlyServiceName) : generateServiceOfferEngTemplatePdf(client, amount,stabilizer,daysPerWeek, this.monthlyServiceId, this.monthlyServiceName)  )
                                : generateServiceOfferCommercialTemplatePdf(client, amount,stabilizer,daysPerWeek, this.monthlyServiceId, this.monthlyServiceName);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
        // Generar PDF
        const pdfBuffer = await page.pdf({
            path: filePath,
            format: 'LETTER',
            printBackground: true,
        });
    
        await browser.close();

        if(send == true){
            const result = await this.senderMailsService.sendServiceOffer(filePath, client);
            if(!result)
                throw new HttpException("Ha ocurrido un error al enviar el correo, revise su conexión.", HttpStatus.REQUEST_TIMEOUT)
            
            const updateClient : UpdateClientDto = {offerPdfAddress : filePath, offerSended: true}
            
            const clientUpdated = await this.ClientRepository.update({clientId: client.clientId} , updateClient);

            return {
                message: `Ha sido enviado la oferta con exito a ${client.name}.`
            }
        }
        else{

            return filePath;
        }
        
    }


    //Muestra el pdf
    async viewPdf(clientId: number, res: Response) {
        try {
            // Construye la ruta completa al archivo
            const client = await this.getItem(clientId);
            if(!client)
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);

            let fullPath = client.offerPdfAddress;
            // Verifica si el archivo existe
            if (fullPath||!fs.existsSync(fullPath)) {
                const path = await this.sendOffer(client.clientId, false );
                fullPath = path
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
