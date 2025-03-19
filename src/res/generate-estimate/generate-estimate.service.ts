import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { EstimateService } from '../estimate/estimate.service';
import { Client } from '../client/client.entity';
import { Service } from '../service/entities/service.entity';
import { format, getYear } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { generateEstimateTemplatePdf } from 'src/logic/pdf-templates';
import { SenderMailsService } from 'src/logic/sender-mails/sender-mails.service';
import { Estimate } from '../estimate/entities/estimate.entity';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GenerateEstimateService {
  constructor(private readonly clientService: ClientService,
    private readonly estimateService: EstimateService,
    private configService:ConfigService,
    @InjectRepository(Service) private repositoryService : Repository<Service>,
    private senderMailsService : SenderMailsService
  ){}

  async generateEstimate(clientId:number, serviceId: number){
    const client = await this.clientService.getItem(clientId);
    
    if(await this.clientService.isActiveById(clientId) == false)
      throw new HttpException("Este cliente esta inactivo", HttpStatus.BAD_GATEWAY)

    const services : Service[] = client.services.filter(service => service.serviceId == serviceId);
    if(services.length == 0)
      throw new HttpException("There are not any service to create an estimated", HttpStatus.NOT_FOUND)

    if(services[0].estimateCreated == true){
      return await this.updateEstimate(clientId, serviceId)
    }
    const saved = await this.estimateService.generateEstimate(new Date(), services, client.commercial);

    //Actualizar el servicio con que ya se creo su estimado
    await this.repositoryService.update({serviceId}, {estimateCreated : true})
    return saved;
  }
  async updateEstimate(clientId:number, serviceId:number){
    const client = await this.clientService.getItem(clientId);
    const services : Service[] = client.services.filter(service => serviceId == service.serviceId)
    const estimates : Estimate[] = client.estimates.filter(estimate => estimate.serviceId = serviceId)

    if(estimates.length == 0){
      const saved = await this.estimateService.generateEstimate(new Date(), services, client.commercial);
      return saved
    }
    else{
      const estimateIds = [...new Set(estimates.map(estimate => estimate.estimateId))].sort((a,b) => b - a)
      console.log(estimateIds)
      const estimate: Estimate[] = estimates.filter(item => item.estimateId == estimateIds[0])
      console.log(estimate);
      const {estimateId, estimateDate } = estimate[0]
      
      const serviceItemsId = [...new Set(services.map(service => service.itemId))]
      const estimateItemsId = [...new Set(estimate.map(estimate => estimate.itemId))]

      //Items q faltan en estimateItemsId (Son los que se van a agregar)
      const itemsOutOfEstimate = serviceItemsId.filter(itemId => estimateItemsId.includes(itemId) == false)
      //Items q no estan en serviceItemId (Son los q se van a eliminar)
      const itemsOutOfService = estimateItemsId.filter(itemId => serviceItemsId.includes(itemId) == false)
      //Items q estan en los dos (Son los q se van a actualizar)
      const itemsInBoth = serviceItemsId.filter(itemId => estimateItemsId.includes(itemId))

      if(itemsOutOfEstimate.length > 0){
        const serviceToEstimate = services.filter(service => itemsOutOfEstimate.includes(service.itemId))
        await this.estimateService.generateEstimateWithId(estimateDate, serviceToEstimate, estimateId, client.commercial);
      }
      if(itemsOutOfService.length > 0){
        const estimateToDelete = estimate.filter(est => itemsOutOfService.includes(est.itemId))
        await this.estimateService.removeEstimates(estimateToDelete);
      }
      if(itemsInBoth.length > 0){
        const serviceToUpdate = services.filter(service => itemsInBoth.includes(service.itemId))
        await this.estimateService.updateEstimate(estimateId, serviceToUpdate, client.commercial);
      }
      return {message:"Se ha actualizado con exito."}
    }
      

  }
  async printEstimatePdf(clientId:number, estimateId:number, sendPdf:boolean){
    //Imprimir cada toPrint
    const client = await this.clientService.getItem(clientId);
    const estimates = client.estimates.filter(estimate => estimate.estimateId == estimateId)
    if(estimates.length == 0)
      throw new HttpException("There are no estimates for this client", HttpStatus.NOT_FOUND);

    const {estimateDate} = estimates[0]
    const month = format(new Date(estimates[0].estimateDate), 'MMMM')
    const year = getYear(estimates[0].estimateDate)
    const estimateInfo = {estimates, month,year,id: estimateId}
    
    const pdfs = [...await this.generatePDF(client, estimateInfo, estimateDate)];
    const result = sendPdf == true ? this.senderMailsService.sendEstimates(pdfs, client) : pdfs[0].filePath;
    return result;
  }
  private savePath = this.configService.get<string>('PDF_SAVE_PATH') || './pdf-storage';

  private async generatePDF(client: Client,toPrint: any,index : any): Promise<any[]>{
      // Iniciar Puppeteer
      if (!fs.existsSync(this.savePath)) {
          fs.mkdirSync(this.savePath, { recursive: true });
      }
      
      const folderPath = path.join(os.homedir(), `${this.savePath}${client.clientId} - ${client.name}/estimates/${format(index,'yyyy-MM-dd')}`);

      if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
      }

      const result : any = await this.generateEstimatePDF(client,toPrint, folderPath);
      return result;
      
  }
  private async generateEstimatePDF(client: Client,toPrint: any, folderPath: string){
      // Ruta completa del archivo
      //toPrint tiene invs, id, month
      let pdfs = [];
      if (!fs.existsSync(path.join(folderPath, `${toPrint.year}/${toPrint.month}`))) {
          fs.mkdirSync(path.join(folderPath, `${toPrint.year}/${toPrint.month}`), { recursive: true });
      }
      const filePath = path.join(folderPath, `${toPrint.year}/${toPrint.month}/EST-${toPrint.id.toString().padStart(6,'0')} ${client.name}.pdf`);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      let amount= 0;
      for(const estimate of toPrint.estimates){
        amount += (estimate.quantity * estimate.price) * ((100-estimate.discount) / 100);
      }
      // Cargar contenido HTML
      const {estimateDate} = toPrint.estimates[0]
      const htmlContent = generateEstimateTemplatePdf(client, toPrint.estimates, estimateDate, toPrint.id, amount);
  
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
      // Generar PDF
      const pdfBuffer = await page.pdf({
          path: filePath,
          format: 'LETTER',
          printBackground: true,
      });
  
      await browser.close();//AQUI TENGO Q LLAMAR EL METODO PARA GUARDAR LA RUTA DLE toPrint
      this.estimateService.updateAddressEstimate(toPrint.estimates, filePath);
      pdfs.push({filePath, id : toPrint.id, date : toPrint.estimates[0].estimateDate});

      return pdfs;
  }
  async viewPdf(estimateId: number, res: Response) {
      try {
          // Construye la ruta completa al archivo
          const estimate = await this.estimateService.findOne(estimateId);
          if(!estimate)
              throw new HttpException('File not found', HttpStatus.NOT_FOUND);

          let fullPath = estimate.pdfAddress;
          const path = await this.printEstimatePdf(estimate.clientId, estimateId, false );
          fullPath = path

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
