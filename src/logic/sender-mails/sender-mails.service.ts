import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'src/res/client/client.entity';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs'
import { format } from 'date-fns';
import { MailResult } from 'src/types/MailResult';

@Injectable()
export class SenderMailsService {

    /**
     *
     */
    private transporter;
    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS') 
            }
        });
    }
    async sendInvoices(pdfs : any[], client:Client){

        let mailsSended = 0;
        let mailsFailed = 0;

        for(const send of pdfs){
            const month = format(send.date, "MMMM")
            const year = new Date(send.date).getFullYear();
            let attachments = [
                {
                    filename: `${client.clientId} INV-${send.id.toString().padStart(6,'0')} ${client.name}.pdf`,
                    path: send.filePath
                }
            ]
            if (fs.existsSync(send.filePathLetterInformation)) 
                attachments.push({
                    filename: `LETTER INFORMATION FOR ${client.name}.pdf`,
                    path: send.filePathLetterInformation
                })
                
            const mailOptions = {
                from: this.configService.get<string>('EMAIL_USER') ?? 'bluediamond.eps@gmail.com',
                to: client.email,
                subject: `Blue Diamond Pool Service Invoice ${month} ${year} `,
                html: `<table style="width:100%; text-align:center; font-family: Arial, sans-serif; color: #333;">
                        <tr>
                            <td>
                                <img src="https://drive.google.com/uc?export=view&id=1FnYj_aiO3NS5hxERCSlF6JbBT1SQeDiD" alt="Logo" style="width: 150px; height: auto; margin-bottom: 10px;">
                            </td>
                        </tr>
                        <tr><td style="font-size: 16px;">CPO : 501017</td></tr>
                        <tr><td style="font-size: 16px;">P.O.Box: 654121 Miami FL 33265</td></tr>
                        <tr><td style="font-size: 16px;">Tel: 786-914-8230, email: bluediamond.eps@gmail.com</td></tr>
                    </table>`,
                attachments
            }
            try{
                const info = await this.transporter.sendMail(mailOptions);
                mailsSended+=1;
                console.log('Correo enviado: ', info);
            }
            catch(error){
                mailsFailed+=1;
                console.error('Error enviando correo: ', error);
            }
        }
        const mailResult : MailResult = {
            message: 'Han sido enviados : ' + mailsSended + ' correos, y no han podido llegar : ' + mailsFailed + " correos",
            mailsSended,
            mailsFailed
        }
        return mailResult
    }
    async sendEstimates(pdfs : any[], client:Client){
        let mailsSended = 0;
        let mailsFailed = 0;
        for(const send of pdfs){
            const month = format(send.date, "MMMM")
            const year = new Date(send.date).getFullYear();
            const mailOptions = {
                from: this.configService.get<string>('EMAIL_USER'),
                to: client.email,
                subject: `Blue Diamond Pool Service Estimate ${month} ${year}`,
                html: `<table style="width:100%; text-align:center; font-family: Arial, sans-serif; color: #333;">
                        <tr>
                            <td>
                                <img src="https://drive.google.com/uc?export=view&id=1FnYj_aiO3NS5hxERCSlF6JbBT1SQeDiD" alt="Logo" style="width: 150px; height: auto; margin-bottom: 10px;">
                            </td>
                        </tr>
                        <tr><td style="font-size: 16px;">CPO : 501017</td></tr>
                        <tr><td style="font-size: 16px;">P.O.Box: 654121 Miami FL 33265</td></tr>
                        <tr><td style="font-size: 16px;">Tel: 786-914-8230, email: bluediamond.eps@gmail.com</td></tr>
                    </table>`,
                attachments:[
                    {
                        filename: `${client.clientId} EST-${send.id.toString().padStart(6,'0')} ${client.name}.pdf`,
                        path: send.filePath
                    }
                ]
            }
            try{
                const info = await this.transporter.sendMail(mailOptions);
                mailsSended+=1;
                console.log('Correo enviado: ', info);
            }
            catch(error){
                mailsFailed+=1;
                console.error('Error enviando correo: ', error);
            }
        }
        const mailResult : MailResult = {
            message: 'Han sido enviados : ' + mailsSended + ' correos, y no han podido llegar : ' + mailsFailed + " correos",
            mailsSended,
            mailsFailed
        }
        return mailResult
    }
    async sendServiceOffer(pdf : string, client:Client){
        let mailsSended = 0;
        let mailsFailed = 0;
        console.log(pdf);
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: client.email,
            subject: `Blue Diamond Pool Service Offer`,
            html: `<table style="width:100%; text-align:center; font-family: Arial, sans-serif; color: #333;">
                        <tr>
                            <td>
                                <img src="https://drive.google.com/uc?export=view&id=1FnYj_aiO3NS5hxERCSlF6JbBT1SQeDiD" alt="Logo" style="width: 150px; height: auto; margin-bottom: 10px;">
                            </td>
                        </tr>
                        <tr><td style="font-size: 16px;">CPO : 501017</td></tr>
                        <tr><td style="font-size: 16px;">P.O.Box: 654121 Miami FL 33265</td></tr>
                        <tr><td style="font-size: 16px;">Tel: 786-914-8230, email: bluediamond.eps@gmail.com</td></tr>
                    </table>`,
            attachments:[
                {
                    filename: `${client.clientId} SERVICES OFFER ${client.name}.pdf`,
                    path: pdf
                }
            ]
        }
        try{
            const info = await this.transporter.sendMail(mailOptions);
            mailsSended+=1;
            console.log('Correo enviado: ', info);
        }
        catch(error){
            mailsFailed+=1;
            console.error('Error enviando correo: ', error);
        }
        return mailsSended == 1 && mailsFailed == 0;
    }
}
