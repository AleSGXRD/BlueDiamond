import { format } from "date-fns";
import * as path from "path";
import * as fs from 'fs';
import { Client } from "src/res/client/client.entity";
import { Invoice } from "src/res/invoice/entities/invoice.entity";
import { Estimate } from "src/res/estimate/entities/estimate.entity";

export function  generateInvoiceTemplatePdf(client:Client, invs:Invoice[], date:Date, id:number, amount:number){
    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;

    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: bolder;
        }body {
            font-family: Arial;
            display:flex;
            flex-direction:column;
            justify-items: center;
            align-items:center;
            
            padding:0.25in 0.75in;
        }
        .invoice {
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width:100%;
            height:100%;
        }
        .invoice-header{
            width:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content: center;
        }
        .invoice-header > div{
            font-weight:400;
            font-size:12px;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            flex-direction:column;
            gap:8px;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        .invoice-price {
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
            padding: 8px;
            gap:4px;
        }
        h1 {
            width: 100%;
            text-align: left;   
            font-size: 14px;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: #000;
        }
        .table {
            width: 100%;
            margin: 10px 0;
            font-size: 12px;
        }
        .description{
            width: 270px; /* Ajusta el ancho deseado */
            text-align:left !important;
        }
        .table th, .table td {
            padding: 8px;
        }
        .table td {
            text-align:center;
        }
        .table th {
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            font-size: 14px;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            gap: 16px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            font-size: 14px;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }
        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner Up" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner Down" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <section class="invoice">
            <div class="invoice-body">
                <section class="invoice-header">
                    <img src="${imageSrc}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
                    <div>Tel.: 786 914 8230, email: bluediamond.eps@gmail.com</div>
                </section>

                <h1>INVOICE</h1>

                <div class="headers">
                    <div class="header">
                        <div>From: </div>
                        <div class="header-title">BLUE DIAMOND POOL SERVICE</div>
                        <div>P.O.BOX 654121</div>
                        <div>MIAMI FL</div>
                        <div>33365</div>
                        <div>USA</div>
                        <div>Email: bluediamond.eps@gmail.com </div>
                        <div>Tel: 786 914 8230</div>
                    </div>
                
                    <div class="header">
                        <div>To: ${client.clientId.toString().padStart(6,'0')}</div>
                        <div class="header-title">${client.name}</div>
                        <div>${client.address}</div>
                        <div>${client.city}</div>
                        <div>${client.cp}</div>
                        <div>${client.country}</div>
                        <div>Email: ${client.email} </div>
                        <div>Tel: ${client.phoneNumber}</div>
                    </div>
                </div>
                
                <div class="terms">
                    <div>Number: INV-${id.toString().padStart(6,'0')}</div>
                    <div>Date: ${format(date,'M/d/yyyy')} </div>
                    <div>Terms: Due on Receipt</div>
                    <div>Due: </div>
                </div>

                <table class="table">
                <thead>
                    <tr>
                    <th>Item</th>
                    <th class="description">Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Discount (%)</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                    invs.map((inv:Invoice,index:number) => `
                        <tr>
                            <td>${(index + 1)}</td>
                            <td class="description">${inv.itemName}</td>
                            <td>$${inv.price}</td>
                            <td>${inv.quantity}</td>
                            <td>${inv.discount} %</td>
                            <td>$${((inv.quantity * inv.price ) * ((100-inv.discount) / 100)).toFixed(2)}</td>
                        </tr>
                        `)
                    }
                </tbody>
                </table>
            </div>
            <div class="invoice-footer">
                <hr>
                    <div class="invoice-price"> 
                        <div class="total"><strong>Sub-Total:</strong> <div>$${amount.toFixed(2)}</div></div>
                        <div class="total"><strong>Tax:</strong> <div>$0.00</div></div>
                        <div class="total"><strong>Total:</strong> <div>$${amount.toFixed(2)}</div></div>
                    </div>
                <hr>
                <div class="footer">
                    <div>Notes:</div>
                    <div>Make all checks payable to Company Name</div>
                    <div>Thank you for your business!</div>
                </div>
            </div>
            
        
        </section>
        
    </body>
    </html>`
}

export function generateEstimateTemplatePdf(client:Client, ests:Estimate[], date:Date, id:number, amount:number){

    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;

    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Estimate</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: 700;
        }
        body {
            font-family: Arial;
            display:flex;
            flex-direction:column;
            justify-items: center;
            align-items:center;
            
            padding:0.25in 0.75in;
        }
        .invoice {
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: start ;
            align-items: center;
            width:100%;
        }
        .invoice-header{
            width:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content: center;
        }
        .invoice-header > div{
            font-weight:400;
            font-size:12px;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            flex-direction:column;
            gap:8px;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
            font-size:13px;
        }
        .invoice-price {
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
            padding: 8px;
        }
        h1 {
            width: 100%;
            text-align: left;   
            font-size: 13px;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: #000;
        }
        .table {
            width: 100%;
            margin: 10px 0;
            font-size: 12px;
        }
        .description{
            width: 270px; /* Ajusta el ancho deseado */
            text-align:left !important;
        }
        .table th, .table td {
            padding: 8px;
        }
        .table td {
            text-align:center;
        }
        .table th {
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            font-size: 13px;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            gap: 16px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            font-size: 14px;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }
        .center-text{
            text-align:center;
        }
        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <section class="invoice">
            <div class="invoice-body">
                <section class="invoice-header">
                    <img src="${imageSrc}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
                    <div>Tel.: 786 914 8230, email: bluediamond.eps@gmail.com</div>
                </section>

                <h1>ESTIMATE</h1>

                <div class="headers">
                    <div class="header">
                        <div>From: </div>
                        <div class="header-title">BLUE DIAMOND POOL SERVICE</div>
                        <div>P.O.BOX 654121</div>
                        <div>MIAMI FL</div>
                        <div>33365</div>
                        <div>USA</div>
                        <div>Email: bluediamond.eps@gmail.com </div>
                        <div>Tel: 786 914 8230</div>
                    </div>
                
                    <div class="header">
                        <div>To: ${client.clientId.toString().padStart(6,'0')}</div>
                        <div class="header-title">${client.name}</div>
                        <div>${client.address}</div>
                        <div>${client.city}</div>
                        <div>${client.cp}</div>
                        <div>${client.country}</div>
                        <div>Email: ${client.email} </div>
                        <div>Tel: ${client.phoneNumber}</div>
                    </div>
                </div>
                
                <div class="terms">
                    <div>Number: INV-${id.toString().padStart(6,'0')}</div>
                    <div>Date: ${format(date,'M/d/yyyy')} </div>
                    <div>Terms: Due on Receipt</div>
                    <div>Due: </div>
                </div>

                <table class="table">
                <thead>
                    <tr>
                    <th>Item</th>
                    <th class="description">Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Discount (%)</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                    ests.map((est:Estimate,index :number) => `
                        <tr>
                            <td>${(index + 1)}</td>
                            <td class="description">${est.itemName}</td>
                            <td>$${est.price}</td>
                            <td>${est.quantity ?? 1}</td>
                            <td>${est.discount ?? 0} %</td>
                            <td>$${((est.quantity * est.price ) * ((100-est.discount) / 100)).toFixed(2)}</td>
                        </tr>
                        `)
                    }
                </tbody>
                </table>
            </div>
            <div class="invoice-footer">
                <hr>
                    <div class="invoice-price"> 
                        <div class="total"><strong>Total:</strong> <div>$${amount.toFixed(2)}</div></div>
                    </div>
                <hr>
                <div>
                <div style="margin-bottom: 8px;">NOTES: THE PRICE IS VALID FOR 7 DAYS </div>
                <div>
                OWNER IS RESPONSIBLE FOR ALL PERMIT/VIOLATIONS FEES ISSUED BY THE CITY OF MIAMI BUILDING DEPARTMENT 
                AND/OR CITY OF MIAMI HEALTH DEPARTMENT.
                </div>
                <div>
                1.- In the event of non-payment or any court action or otherwise in which Blue Diamond Pool Service prevails, it shall have the 
                right to remove all parts which can be returned to manufacturer and to recover reasonable attorney fees and costs. 
                </div>
                <div>
                2.- In case Client wishes to cancel the contract after the initial deposit has been paid, Blue Diamond Pool Service will not be 
                responsible for refunding any part of it. 
                </div>
                <div>
                3.- The terms of the contract will not be valid in case of non-payment of advance deposit. 
                </div>
                <div>
                4.- The contract will be null and void in case of nonpayment and Blue Diamond Pool Service has no obligation to return any 
                given deposits. 
                </div>
                <div>
                5.- If the client does not sign the contract but gives the initial deposit, it will be considered that the client understands and 
                agrees to all the terms and conditions including the total amount of the contract and payment terms.
                </div>
                </div>
                <div class="headers">
                    <p>Signed: </p>
                    <p>Date: </p>
                    <p>Signed: </p>
                    <p>Date: </p>
                </div>
            </div>
            
        
        </section>
        
    </body>
    </html>`
}

export function  generateServiceOfferCommercialTemplatePdf(client:Client, amount:number, stabilizer:number, daysPerWeek:string, monthlyId:number, monthlyName:string){
    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;


    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    const bluediamond1Path = path.resolve(__dirname, 'images/Bluediamond-1.jpg');
    const bluediamond1Base64 = fs.readFileSync(bluediamond1Path).toString('base64'); 
    const bluediamond1Src = `data:image/png;base64,${bluediamond1Base64}`;

    console.log('imprimir: ',client,amount, monthlyId, monthlyName);

    const arrDaysPerWeek = daysPerWeek.split(', ')
    const cantDaysPerWeek = arrDaysPerWeek.length
    const writedDaysPerWeek = arrDaysPerWeek.slice(0,cantDaysPerWeek - 1).join(', ') + " and " + arrDaysPerWeek.at(cantDaysPerWeek-1) 

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Offer</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: 500;
            margin:0;
            padding:0;
        }
        body {
            margin: 0;
            display:flex;
            flex-direction:column;
            justify-items: start;
            align-items:center;
            padding: 0.25in 0.75in;
        }
        .invoice{
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            font-size: 16px;
            line-height: 1.50rem;
            width: 100%;
            gap: 24px;
        }
        .page{
            page-break-after:always;
            display:flex;
            flex-direction:column;
            gap:16px;
            padding-top: 1.5in;
            padding-bottom: 0.5in;
        }
        .invoice-header{
            position:fixed;
            top:40px;
            left:0;
            right:0;
            width:100%;
            display:flex;
            justify-content: center;
        }
        .certificate{
            position:fixed;
            top:40px;
            left:0.75in;
            width:100%;
            display:flex;
            justify-content: start;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            flex-direction:column;
            gap:16px;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 1.50rem;
        }
        .invoice-price {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
        }
        h1 {
            width: 100%;
            text-align: left;   
            font-size: 24px;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 16px;
            display: flex;
            flex-direction: column;
            color: #000;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .description{
            width: 300px; /* Ajusta el ancho deseado */
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .table th {
            background-color: #f2f2f2;
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            font-size: 12px;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            text-align:left;
            gap: 24px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            padding-left: 16px;
            font-size: 12px;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }

        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }

        .we-are{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            width: 100%;
            margin: 32px 0px;
            gap:8px;
        }
        .we-are > div{
            text-align: center;   
            font-weight: 800;
        }

        p{
            text-indent:30px;
            text-wrap: pretty;
        }
        h3{
            font-weight: 800;
            font-size:18px;
        }
        .text-light{
            font-weight:300;
        }
        .text-bold{
            font-weight: 800;
        }
        ul{
            padding: 0 32px;
        }
        ol{
            margin:0;
            padding:0 32px;
        }
        ol > li{
            font-weight:800;
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <div class="invoice-header">
            <img src="${imageSrc}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <div class="certificate">
            <img src="${bluediamond1Src}" alt="Logo" style="max-width: 86px;">
        </div>
        <section class="invoice">
            <div class="invoice-body">
                <div class="page">
                    
                    <div class="we-are">
                        <div>The Best Pool Service in Miami</div>
                        <div>14623 SW 125 Place Miami FL 33186-7403</div>
                        <div>Tel: 786-914-8230</div>
                    </div>
                    <div class="text-bold">
                        To: ${client.name}
                    </div>
                    <div>
                        Attn: <strong class="text-bold">Blue Diamond Pool Service</strong>
                    </div>

                    <p style="text-indent: 30px">
                        We would like to take this opportunity to thank you, for allowing us to present 
                        you with an offer for: <strong class="text-bold">Pool Service, Maintenance & Repairs</strong>
                    </p>

                    <h3>
                        About Blue Diamond Pool Service
                    </h3>

                    <p>
                        We have been in business for 10 years. We have a recognized reputation and
                        an excellent quality of service to provide customer satisfaction. We take care of 
                        commercial accounts and we have insurance coverage and all licenses required by the 
                        State of Florida. Our technicians wear uniforms, behave respectfully and they are a 
                        team of highly qualified specialists and have experience in all aspects of the swimming 
                        pool industry. Our goal is the complete satisfaction of all our customers offering them 
                        a first-class service.
                    </p>

                    <h3>
                        Pool Maintenance / Monthly Charges
                    </h3>

                    <p>
                        The maintenance fees are established by taking into account the structure / full 
                        size of the pool, the condition of the pool equipment and the adjacent shrubs. This is 
                        how we determine the labor required and the amount of chemical products that your 
                        property requires every month.
                    </p>
                    <p>
                        <strong>Blue Diamond Pool Service</strong> will work closely with you to ensure that all your 
                        pool service and maintenance expectations are met.
                    </p>

                    <h3>
                        Pool Maintenance includes but is not limited to:
                    </h3>
                    
                    <ul>
                        <li>Tile cleaning</li>
                        <li>Empty skimmer and strainer baskets.</li>
                        <li>Meticulously vacuum and brush pool</li>
                    </ul>
                </div>
                <div class="page">
                    <ul>
                        <li>Removing debris from surface of water</li>
                        <li>Backwash and recharge filter.</li>
                        <li>Keep swimming pool water chemically balanced.</li>
                        <li>Verification of pool equipment (Engine, Filters, Timmer, etc.).</li>
                        <li>Stabilizer (1 time charge per year) INCLUDED WITH THIS CONTRACT. With a cost of $${stabilizer.toFixed(2)} each time we perform the procedure </li>
                    </ul>
                    <p style="font-weight:200">
                        The pool is serviced ${cantDaysPerWeek} days a week. The pool service for cleaning is done ${writedDaysPerWeek}.
                    </p>
                    <ul>
                        <li>
                            The monthly cost of maintenance would be $${amount.toFixed(2)} due on the first of each 
                            month. We require a signed contract prior to starting service and 30-day
                            cancellation clause.
                        </li>
                    </ul>

                    <div>
                        Additional repairs and extra services are not included in the monthly payment of 
                        maintenance. In advance to any work being done, we will inform you about the 
                        estimates for your prior approval. Once approved by management we will start to 
                        work.
                    </div>
                    <div style="color:red; font-weight:800;">
                        In case the pool breaks down due to different causes, the service will be 
                        charged separately according to the chemical products used and the work to 
                        be done.
                        <ol>
                            <li>
                                If the pool is short of water, the client must add water one day before the 
                                service in the evening, because if he does it before, the pool loses chlorine, 
                                decompensates and turns green. If the customer does not take the required 
                                attention and more chlorine or other products have to be used to stabilize the 
                                pool, he has to assume those charges.
                            </li>
                            <li>
                                In case the pool picks up phosphate, other products must be applied to 
                                stabilize it, extra visits must be made to clean the filters and give it a hose 
                                vacuum, for which the customer has an extra charge.
                            </li>
                            <li>
                                In the event that the pool has a leaching, the client must inform us as we 
                                work together with companies that can solve the problem and avoid worse 
                                situations.
                            </li>
                            <li>
                                Payment of the Monthly Invoice is due from the 1st to the 5th of each 
                                month.
                            </li>
                            <li>
                                In case of heavy downpours and thunder, the service will only add chlorine 
                                to the pool.
                            </li>
                        </ol>
                    </div>
                </div>
                
                <div class="page">
                    <div>
                        Pricing: Customers agrees to pay the Monthly service fee.
                    </div>
                    <div>
                        Monthly Service: $${amount.toFixed(2)}
                    </div>
                    <div>
                        Frequency: ${cantDaysPerWeek}x per week full service (${writedDaysPerWeek})
                    </div>
                    <div class="text-light">
                        Annual Stabilizer: $${stabilizer.toFixed(2)}
                    </div>
                    <div class="text-light">
                        Invoices and statement are issued on the first of each month, for that month.
                    </div>
                    <div class="text-light">
                        Termination: Should you wish to cancel this contract at any time, you may do so by providing 
                        a 30-day written notice via email.
                    </div>
                    <div class="text-light">
                        Acceptance of Proposal- The above prices, specifications and conditions are satisfactory and 
                        are hereby accepted. You are authorized to do the work as specified. Payment will be made 
                        as outlined above.
                    </div>
                    <div>
                        The goal of <strong class="text-bold">Blue Diamond Pool Service</strong> is to help you obtain the specialized and 
                        reliable service you deserve.
                    </div>
                    <p>
                        We appreciate the occasion to work with you and provide you with excellent 
                        quality pool service. This proposal is being submitted for your consideration. For any 
                        questions, or if you would like to schedule a meeting, please do not hesitate to contact 
                        me at 786-914-8230 at your earliest convenience.
                    </p>
                    <div>
                        The prices, conditions and specifications mentioned before, are hereby accepted. You 
                        are authorized to do the work as described. Payment will be made as stated above.
                    </div>


                    <div class="invoice-footer">
                        <div class="footer">
                            <div style="margin: 16px 0;">Kindest regards</div>
                            <div>Jesús Reyes</div>
                            <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width:100%">
                                <div>President/Owner</div>
                                <div>Management</div>
                            </div>
                            <div>Blue Diamond Pool Service</div>
                        </div>
                    </div>

                    <div class="headers">
                        <div>Date ${format(new Date(),'dd/MM/yyyy')} </div>
                        <div>Date ________________________ </div>
                        <div>Signed ______________________ </div>
                        <div>Signed ______________________ </div>
                    </div>
                </div>
            </div>

        </section>
        
    </body>
    </html>`
}

export function  generateServiceOfferEspTemplatePdf(client:Client, amount:number, stabilizer:number, daysPerWeek:string, monthlyId:number, monthlyName:string){
    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;


    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    const bluediamond1Path = path.resolve(__dirname, 'images/Bluediamond-1.jpg');
    const bluediamond1Base64 = fs.readFileSync(bluediamond1Path).toString('base64'); 
    const bluediamond1Src = `data:image/png;base64,${bluediamond1Base64}`;

    const cantDaysPerWeek = daysPerWeek.split(', ').length

    console.log('imprimir: ',client,amount, monthlyId, monthlyName);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Offer</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: 500;
            margin:0;
            padding:0;
        }
        body {
            margin: 0;
            display:flex;
            flex-direction:column;
            justify-items: start;
            align-items:center;
            padding: 0.25in 0.75in;
        }
        .invoice{
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            font-size: 16px;
            line-height: 1.50rem;
            width: 100%;
            gap: 24px;
        }
        .page{
            page-break-after:always;
            display:flex;
            flex-direction:column;
            gap:16px;
            padding-top: 1.5in;
            padding-bottom: 0.5in;
        }
        .invoice-header{
            position:fixed;
            top:40px;
            left:0;
            right:0;
            width:100%;
            display:flex;
            justify-content: center;
        }
        .certificate{
            position:fixed;
            top:40px;
            left:0.75in;
            width:100%;
            display:flex;
            justify-content: start;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            flex-direction:column;
            gap:16px;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 1.50rem;
        }
        .invoice-price {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
        }
        h1 {
            width: 100%;
            text-align: left;   
            font-size: 24px;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 16px;
            display: flex;
            flex-direction: column;
            color: #000;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .description{
            width: 300px; /* Ajusta el ancho deseado */
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .table th {
            background-color: #f2f2f2;
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            font-size: 12px;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            text-align:left;
            gap: 24px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            padding-left: 16px;
            font-size: 12px;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }

        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }

        .we-are{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            width: 100%;
            margin: 16px 0px;
            gap:8px;
        }
        .we-are > div{
            text-align: center;   
            font-weight: 800;
        }

        p{
            text-indent:30px;
            text-wrap: pretty;
        }
        h3{
            font-weight: 800;
            font-size:18px;
        }
        .text-light{
            font-weight:300;
        }
        .text-bold{
            font-weight: 800;
        }
        ul{
            padding: 0 32px;
        }
        ol{
            margin:0;
            padding:0 32px;
        }
        ol > li{
            font-weight:800;
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <div class="invoice-header">
            <img src="${imageSrc}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <section class="invoice">
            <div class="invoice-body">
                <div class="page">
                    
                    <div class="we-are">
                        <div>The Best Pool Service in Miami</div>
                        <div>14623 SW 125 Place Miami FL 33186-7403</div>
                        <div>Tel: 786-914-8230</div>
                    </div>
                    <div class="text-bold">
                        To: ${client.name}
                    </div>
                    <div>
                        Attn: <strong class="text-bold">Blue Diamond Pool Service</strong>
                    </div>

                    <p style="text-indent: 30px">
                        Nos gustaría aprovechar esta oportunidad para agradecerle por permitirnos presentarle una oferta para: <strong class="text-bold">Servicio de piscina, mantenimiento y reparaciones</strong>
                    </p>

                    <p style="font-weight:800; color:red;">
                        Nota informativa al cliente: Nuestra compañía le ofrece una Oferta Especial, Incluimos en el servicio un
                        Cartucho Nuevo Gratis cada 18 meses siempre que se mantenga con nosotros.
                    </p>

                    <h3>
                        Acerca de Blue Diamond Pool Service.
                    </h3>

                    <p>
                        Nuestra experiencia en este servicio data alrededor de 10 años. Tenemos una reputación reconocida y una excelente 
                        calidad de servicio para proporcionar la satisfacción del cliente. Nos ocupamos de piscinas residenciales y comerciales. 
                        Tenemos cobertura de seguro y todas las licencias requeridas por el Estado de Florida. Nuestros técnicos usan uniformes, 
                        se comportan con respeto, son un equipo de especialistas altamente calificados y tienen experiencia en todos los aspectos 
                        de la industria de las piscinas. Nuestro objetivo es la completa satisfacción de todos nuestros clientes ofreciéndoles un 
                        servicio de primera clase.
                    </p>

                    <h3>
                        Mantenimiento de la piscina / Cargos mensuales.
                    </h3>

                    <p>
                        Las tarifas de mantenimiento se establecen teniendo en cuenta la estructura y tamaño completo de la piscina, la condición 
                        del equipamiento asociado y los arbustos adyacentes. Así es como determinamos la mano de obra requerida y la cantidad 
                        de productos químicos que su propiedad requiere cada mes.
                    </p>
                    <p>
                        <strong class="text-bold">Blue Diamond Pool Service</strong> trabajará en estrecha colaboración con usted para garantizar que se cumplan todas las 
                        expectativas de servicio y mantenimiento de su piscina.
                    </p>

                    <h3>
                        El mantenimiento de la piscina incluye, pero no se limita a:
                    </h3>
                     
                    <ul>
                        <li>Limpieza de azulejos.</li>
                        <li>Limpieza de las cestas tanto del motor como del Skimmer.</li>
                        <li>Cepillado de la piscina.</li>
                    </ul>
                </div>
                <div class="page">
                    <ul>
                        <li>Eliminación de restos en la superficie del agua o fondo de la piscina.</li>
                        <li>Limpieza del Filtro cada 15 días o cuando este lo requiera.</li>
                        <li>Mantener el agua de la piscina químicamente balanceada.</li>
                        <li>Verification of pool equipment (Engine, Filters, Timmer, etc.).</li>
                        <li>Verificación de los equipos asociados a la piscina (motor, filtros, Temporizador, etc.).</li>
                        <li>Estabilización, cada seis meses con un costo de <strong class="text-bold">$${stabilizer}</strong> cada vez que realizamos el procedimiento.</li>
                    </ul>
                    <p >
                        La piscina se atenderá <strong class="text-bold">${cantDaysPerWeek} día(s) a la semana</strong>. El costo mensual de mantenimiento será <strong class="text-bold">$${amount.toFixed(2)}</strong> debiéndose pagar el 
                        primero de cada mes.
                    </p>
                    <div >
                        Los aspectos que a continuación presentamos y debería tener en cuenta, tributarán en un mejor servicio y mantenimiento 
                        de su piscina: 
                        <ul>
                            <li>
                               Mantener el nivel del agua de la piscina, este debe de estar a la mitad de la entrada del skimmer. si fuese necesario 
                                agregar agua, siempre antes del día del servicio del especialista.
                            </li>
                            <li>
                                Según la asociación nacional de piscinas, en el sur de florida, en el verano, para que el agua mantenga niveles 
                                microbiológicos adecuados, se recomienda filtrar su piscina un tiempo de 12 horas al día para el caso de sistemas 
                                de sal y 8 horas cuando se traten con cloro. En el invierno ese tiempo es menor, esto depende del tamaño y 
                                entorno que rodea su piscina. Nuestros especialistas darán recomendaciones para cada caso específico, aunque 
                                usted puede sentirse libre de preguntarles y ellos le atenderán gustosamente.
                            </li>
                            <li>
                                Si usted tiene puerta para acceder a la piscina, el día estipulado para servicio debería estar abierta, otra alternativa 
                                pudiera ser por ejemplo, suministrarnos una llave de la puerta, BDS mantendrá en todo momento un adecuado 
                                control de la misma.
                            </li>
                            <li>
                                Los perros u otros animales que pudiera interferir con la calidad del servicio o seguridad del especialista, se 
                                deberán tener controlados en el momento de dichos trabajos.
                            </li>
                            <li>
                                En caso de lluvia fuerte o tormentas eléctricas, está prohibido utilizar herramientas dentro de la piscina, BDS se 
                                toma muy en serio la seguridad de sus especialistas. En tales casos, solo se realizará el tratamiento químico para 
                                que el agua de su piscina se mantenga en buenas condiciones.
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="page">
                    <ul>
                        <li>
                            En caso de catástrofes naturales, ya sean huracanes, tormentas tropicales, etc. de ser necesario, puede que BDS
                            cobre un cargo extra por la limpieza o el uso de químicos, siempre le será comunicado dicha necesidad.
                        </li>
                        <li>
                            En caso de que tenga una actividad festiva o de otro tipo, podemos ser flexibles en el día del servicio incluyendo 
                            el mismo día del evento, para estos casos se requiere una semana de pre aviso.
                        </li>
                        <li>
                            Tenemos estipulado dos semanas de vacaciones al año para nuestros técnicos, le será notificado con antelación 
                            y nos aseguraremos de dejar su piscina en óptimas condiciones para que todo funcione correctamente.
                        </li>
                        <li>
                            En caso de que la piscina se descompense por diferentes causas se le cobrara el servicio a parte, según 
                            los productos químicos que se utilicen y el trabajo que se realice.
                        </li>
                        <li style="color:red; font-weight:800;">
                            En caso de que la piscina se descompense por diferentes causas se le cobrara el servicio a parte, según 
                            los productos químicos que se utilicen y el trabajo que se realice.
                        </li>
                        <li style="color:red; font-weight:800;">
                            En caso de que la piscina esta falta de agua, el cliente debe echarle agua un día antes del servicio, por la 
                            noche ya que, si lo hace antes, la piscina pierde el cloro, se descompensa y se pone verde. Si el Cliente 
                            no toma la Atención requerida y hay que echar más cloro u otros productos para estabilizarla, tiene que 
                            asumir esos cargos.
                        </li>
                        <li style="color:red; font-weight:800;">
                            En caso que la piscina coja fosfato hay que aplicar otros productos para estabilizarla, que no son los que 
                            normalmente se utilizan en el servicio, hay que realizar visitas extras para limpiar los filtros y darle vacoum 
                            de manguera, por lo que el cliente tiene un cargo extra.
                        </li>
                        <li style="color:red; font-weight:800;">
                            En caso que la piscina tenga liqueo, el cliente debe informarlo, ya que trabajamos en conjunto con 
                            compañías que pueden resolver el problema y así evitar situaciones peores.
                        </li>
                        <li style="color:red; font-weight:800;">
                            En caso que el Cliente quiera limpiar la piscina con presión Cleaner hay que darle un Vacoum por la 
                            suciedad que le cae, esto tiene un costo extra.
                        </li>
                        <li style="color:red; font-weight:800;">
                            El pago de la Factura Mensual se realizará del 1 al 5 de cada mes.
                        </li>
                    </ul>
                    <div style="color:red; font-weight:800;">
                        En caso de que su piscina sea de sistema de sal la célula se lavara cada 3 meses para eliminar suciedad 
                        y calcio, haciéndole un lavado de 50% de acido y 50% de agua según el manual de este tipo de sistemas.
                    </div>
                </div>
                <div class="page">
                    <p>
                        Por último, mencionar que ofrecemos a nuestros clientes servicios de actualización de equipos de última generación y 
                        remodelaciones de instalaciones, cualquier pregunta comuníquese con nosotros y le mostraremos todo lo que tenemos 
                        para usted. Las reparaciones y los servicios adicionales no están incluidos en el pago mensual de mantenimiento. Antes 
                        de realizar cualquier trabajo, le informaremos acerca de las estimaciones para su aprobación previa. Una vez que la 
                        administración lo apruebe, comenzaremos a trabajar.
                    </p>
                    <div>
                        El objetivo de <strong class="text-bold">Blue Diamond Pool Service</strong> es ayudarlo a obtener el servicio especializado y confiable que se merece.
                    </div>
                    <p>
                        Agradecemos la oportunidad de trabajar con usted y brindarle un servicio de piscina de excelente calidad. Esta propuesta 
                        se presenta para su consideración. Para cualquier pregunta, o si desea programar una reunión, no dude en ponerse en 
                        contacto con nosotros al 786-914-8230, le atenderemos a la mayor brevedad posible.
                    </p>

                    <div class="invoice-footer">
                        <div class="footer">
                            <div style="margin: 16px 0;">Saludos cordiales</div>
                            <div>Jesús Reyes</div>
                            <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width:100%">
                                <div>Presidente / Propietario</div>
                            </div>
                            <div>Blue Diamond Pool Service</div>
                        </div>
                    </div>

                    <div class="headers">
                        <div>Date ${format(new Date(),'dd/MM/yyyy')} </div>
                        <div>Date ________________________ </div>
                        <div>Signed ______________________ </div>
                        <div>Signed ______________________ </div>
                    </div>
                </div>
            </div>

        </section>
        
    </body>
    </html>`
}


export function  generateServiceOfferEngTemplatePdf(client:Client, amount:number, stabilizer:number, daysPerWeek:string, monthlyId:number, monthlyName:string){
    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;


    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    const bluediamond1Path = path.resolve(__dirname, 'images/Bluediamond-1.jpg');
    const bluediamond1Base64 = fs.readFileSync(bluediamond1Path).toString('base64'); 
    const bluediamond1Src = `data:image/png;base64,${bluediamond1Base64}`;

    const arrDaysPerWeek = daysPerWeek.split(', ')
    const cantDaysPerWeek = arrDaysPerWeek.length
    const writedDaysPerWeek = arrDaysPerWeek.slice(0,cantDaysPerWeek - 1).join(', ') + " and " + arrDaysPerWeek.at(cantDaysPerWeek-1) 

    console.log('imprimir: ',client,amount, monthlyId, monthlyName);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Offer</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: 500;
            margin:0;
            padding:0;
        }
        body {
            margin: 0;
            display:flex;
            flex-direction:column;
            justify-items: start;
            align-items:center;
            padding: 0.25in 0.75in;
        }
        .invoice{
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            font-size: 16px;
            line-height: 1.50rem;
            width: 100%;
            gap: 24px;
        }
        .page{
            page-break-after:always;
            display:flex;
            flex-direction:column;
            gap:16px;
            padding-top: 1.5in;
            padding-bottom: 0.5in;
        }
        .invoice-header{
            position:fixed;
            top:40px;
            left:0;
            right:0;
            width:100%;
            display:flex;
            justify-content: center;
        }
        .certificate{
            position:fixed;
            top:40px;
            left:0.75in;
            width:100%;
            display:flex;
            justify-content: start;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            flex-direction:column;
            gap:16px;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 1.50rem;
        }
        .invoice-price {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
        }
        h1 {
            width: 100%;
            text-align: left;   
            font-size: 24px;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 16px;
            display: flex;
            flex-direction: column;
            color: #000;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .description{
            width: 300px; /* Ajusta el ancho deseado */
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .table th {
            background-color: #f2f2f2;
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            font-size: 12px;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            text-align:left;
            gap: 24px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            padding-left: 16px;
            font-size: 12px;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }

        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }

        .we-are{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            width: 100%;
            margin: 16px 0px;
            gap:8px;
        }
        .we-are > div{
            text-align: center;   
            font-weight: 800;
        }

        p{
            text-indent:30px;
            text-wrap: pretty;
        }
        h3{
            font-weight: 800;
            font-size:18px;
        }
        .text-light{
            font-weight:300;
        }
        .text-bold{
            font-weight: 800;
        }
        ul{
            padding: 0 32px;
        }
        ol{
            margin:0;
            padding:0 32px;
        }
        ol > li{
            font-weight:800;
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <div class="invoice-header">
            <img src="${imageSrc}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <section class="invoice">
            <div class="invoice-body">
                <div class="page">
                    
                    <div class="we-are">
                        <div>The Best Pool Service in Miami</div>
                        <div>14623 SW 125 Place Miami FL 33186-7403</div>
                        <div>Tel: 786-914-8230</div>
                    </div>
                    <div class="text-bold">
                        To: ${client.name}
                    </div>
                    <div>
                        Attn: <strong class="text-bold">Blue Diamond Pool Service</strong>
                    </div>

                    <p style="text-indent: 30px">
                        We would like to take this opportunity to thank you for allowing us to present you with an offer for: <strong class="text-bold">Pool service, maintenance and repairs (Pool and Jacuzzi)</strong>
                    </p>

                    <p style="font-weight:800; color:red;">
                        Customer information note: Our company offers you a Special Offer, we include in the service a Free
                        New Cartridge every 18 months as long as you stay with us.
                    </p>

                    <h3 style="font-size:16px;">
                        Customer information note: Our company offers you a Special Offer, we include in the service a Free New 
                        Cartridge every 18 months as long as you stay with us.
                    </h3>

                    <h3>
                        About Blue Diamond Pool Service.
                    </h3>

                    <p>
                        Our experience in the Pool Service area dates back around 10 years. We have a recognized reputation and an excellent 
                        quality of service to provide customer satisfaction. We deal with residential and commercial pools. We have all insurance 
                        coverages and all the licenses required by the State of Florida. Our technicians wear uniforms, behave with respect, are a 
                        team of highly qualified specialists, and have experience in all aspects of the swimming pool industry. Our goal is the 
                        complete satisfaction of all our customers, offering them a first-class service.
                    </p>
                    <p>
                        Maintenance of the pool / Monthly charges. Maintenance fees are established considering the structure and full size of the 
                        pool, the condition of the associated equipment and the adjacent shrubs. This is how we determine the labor required and 
                        the amount of chemicals that your property requires each month.
                    </p>
                    <p>
                        <strong class="text-bold">Blue Diamond Pool Service (BDPS)</strong> will work closely with you to ensure that all your pool service and maintenance 
                        expectations are met.
                    </p>

                </div>
                <div class="page">
                    <h3>
                        Pool maintenance includes but is not limited to:
                    </h3>
                     
                    <ul>
                        <li>Tile cleaning.</li>
                        <li>Cleaning of the baskets of both the motor and the skimmer.</li>
                        <li>Brushing the pool.</li>
                        <li>Removal of debris on the surface of the water or bottom of the pool.</li>
                        <li>Cleaning the filter every 15 days or when it will be required.</li>
                        <li>Maintain chemically balanced pool water.</li>
                        <li>Verification of the equipment associated with the pool (motor, filters, timer, etc.)</li>
                        <li>Stabilization, every six months with a cost of <strong class="text-bold">$${stabilizer}</strong> each time we perform the procedure.</li>
                    </ul>
                    <p >
                        The pool will be attended <strong class="text-bold">${cantDaysPerWeek} day (s) a week</strong>. The monthly maintenance cost will be <strong class="text-bold">$${amount.toFixed(2)}</strong> due to be paid the first of 
                        each month. <strong>Service on ${writedDaysPerWeek}</strong>
                    </p>
                    <div >
                        The aspects that will result in a better service and maintenance of your pool and that you should keep in mind and which 
                        we present to you below are:
                        <ul>
                            <li>
                               Maintain the water level of the pool. Your pool water level must be halfway up the entrance of the skimmer. If necessary, 
                                add water, always before the day of the specialist's service.
                            </li>
                            <li>
                                According to the National Pool Association, in Southern Florida, during Summer, for water to maintain adequate 
                                microbiological levels, it is recommended to filter your pool for 12 hours a day for salt systems, and 8 hours when they are 
                                treated with chlorine. In winter that time is less, this depends on the size and environment surrounding your pool. Our 
                                specialists will give recommendations for each specific case, although you may feel free to ask them and they will gladly 
                                assist you.
                            </li>
                            <li>
                                If you have a door to access the pool, the day stipulated for service it should be open, another alternative could be for 
                                example, provide us with a door key, BDPS will maintain always an adequate control of it.
                            </li>
                            <li>
                                Dogs or other animals that could interfere with the quality of service or safety of the specialist, should be controlled at the 
                                time of such work.
                            </li>
                            <li>
                                In case of heavy rain or electrical storms, it is forbidden to use tools inside the pool, BDPS takes the safety of its specialists 
                                very seriously. In such cases, only the chemical treatment will be carried out so that the water in your pool remains in good 
                                condition.
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="page">
                    <ul>
                        <li>
                            In case of natural disasters, whether hurricanes, tropical storms, etc., if necessary, BDPS may charge an additional fee
                            for cleaning the pool or using chemical products, this need will always be communicated in advance to you, for your prior 
                            approval.
                        </li>
                        <li>
                            We have a stipulated two weeks of vacation a year for our technicians, you will be notified in advance and we will make 
                            sure to leave your pool in optimal conditions so that everything works correctly.
                        </li>
                    </ul>
                    <div style="color:red; font-weight:800;">
                        In case the pool breaks down due to different causes, the service will be charged separately 
                        according to the chemical products used and the work to be done.
                        <ul>
                            <li style="color:red; font-weight:800;">
                               If the pool is short of water, the client must add water one day before the service in the evening, 
                                because if he does it before, the pool loses chlorine, decompensates and turns green. If the 
                                customer does not take the required attention and more chlorine or other products have to be 
                                used to stabilize the pool, he has to assume those charges.
                            </li>
                            <li style="color:red; font-weight:800;">
                                In case the pool picks up phosphate, other products must be applied to stabilize it, extra visits 
                                must be made to clean the filters and give it a hose vacuum, for which the customer has an extra 
                                charge.
                            </li>
                            <li style="color:red; font-weight:800;">
                                In the event that the pool has a leaching, the client must inform us as we work together with 
                                companies that can solve the problem and avoid worse situations.
                            </li>
                            <li style="color:red; font-weight:800;">
                                Payment of the Monthly Invoice is due from the 1st to the 5th of each month.
                            </li>
                            <li style="color:red; font-weight:800;">
                                 In case of heavy downpours and thunder, the service will only add chlorine to the pool.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div>
                            Finally, we have to mention that we offer our customers update services of latest generation equipment and remodeling of 
                            facilities, any question contacts us and we will show you everything we have for you.
                        </div>

                        <div>
                            The goal of <strong class="text-bold">Blue Diamond Pool Service</strong> is to help you obtain the specialized and reliable service you deserve.
                        </div>
                    </div>
                    
                </div>
                <div class="page">

                    <p>
                        We appreciate the opportunity to work with you and provide an excellent quality pool service. This proposal is presented 
                        for your consideration. For any question, or if you want to schedule a meeting, do not hesitate to contact us at 786-914-
                        8230, we will assist you as soon as possible.
                    </p>
                    

                    <div class="invoice-footer">
                        <div class="footer">
                            <div style="margin: 16px 0;">Best regards</div>
                            <div>Jesús Reyes</div>
                            <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width:100%">
                                <div>President / Owner</div>
                            </div>
                            <div>Blue Diamond Pool Service</div>
                        </div>
                    </div>

                    <div class="headers">
                        <div>Date ${format(new Date(),'dd/MM/yyyy')} </div>
                        <div>Date ________________________ </div>
                        <div>Signed ______________________ </div>
                        <div>Signed ______________________ </div>
                    </div>
                </div>
            </div>

        </section>
        
    </body>
    </html>`
}

export function  generateLetterInformationTemplatePdf(client:Client, mappedOldInvoices:any[], lastId:number, lastMonth: string, amount:number){
    const imagePath = path.resolve(__dirname, 'images/HomeAdvisor.png');
    const imageBase64 = fs.readFileSync(imagePath).toString('base64'); 
    const imageSrc = `data:image/png;base64,${imageBase64}`;

    const bluediamond4Path = path.resolve(__dirname, 'images/Bluediamond-4 transp.png');
    const bluediamond4Base64 = fs.readFileSync(bluediamond4Path).toString('base64'); 
    const bluediamond4Src = `data:image/png;base64,${bluediamond4Base64}`;

    const bluediamond3Path = path.resolve(__dirname, 'images/Bluediamond-3.jpg');
    const bluediamond3Base64 = fs.readFileSync(bluediamond3Path).toString('base64'); 
    const bluediamond3Src = `data:image/png;base64,${bluediamond3Base64}`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carta de información</title>
        <style>
        *{
            font-family:  Calibri, sans-serif;
            font-weight: 500;
        }
        body {
            margin: 0;
            display:flex;
            flex-direction:column;
            justify-items: start;
            align-items:center;
            padding: 0.25in 0.75in;
        }
        .invoice{
            position:relative;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            font-size: 16px;
            line-height: 1.50rem;
            width: 100%;
            gap: 48px;
        }
        .invoice-header{
            width:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content: center;
            gap:24px;
        }
        .logo{
            width:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content: center;
        }
        .logo > div{
            font-weight:200;
            
            font-size: 14px;
            line-height: 1.25rem;
        }
        .invoice-body{
            width: 100%;
            display:flex;
            gap:16px;
            flex-direction:column;
        }
        .invoice-footer{
            width: 100%;
            display: flex;
            flex-direction: column;
            
            font-size: 16px;
            line-height: 1.50rem;
        }
        .invoice-price {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            text-align: end;
            margin-top:8px;
            margin-bottom:8px;
        }
        h1 {
            width: 100%;
            text-align: center;   
            font-size: 13px;
        }
        .we-are{
            gap : 0px !important;
            width: 100%;
            text-align: center;   
        }
        .we-are > div{
            font-size: 16px;
            font-weight: 800;
        }
        .header, .footer {
            width: 100%;
            text-align: left;
            font-size: 16px;
            line-height: 1.50rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: #000;
        }
        .table {
            width: 100%;
            
            font-size: 18px;
            line-height: 1.75rem;
        }
        .description{
            width: 270px; /* Ajusta el ancho deseado */
            text-align:left !important;
        }
        .table td {
            text-align:center;
        }
        .table th {
            text-align: left;
        }
        .total {
            display: grid;
            width: 35%;
            
            font-size: 14px;
            line-height: 1.25rem;
            grid-template-columns: repeat(2,1fr);
            text-align: right;
        }
        .headers{
            display: grid;
            grid-template-columns: repeat(2,1fr);
            width: 100%;
            gap: 16px;
        }
        .terms{
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            align-items: start;
            width: 100%;
            color: #000;
            
            font-size: 14px;
            line-height: 1.25rem;
            padding-top:4px;
            padding-bottom:4px;

        }
        .header-title{
            font-weight: bolder;
            text-transform: uppercase;
        }
        hr{
            border: 0;
            height: 0.5px;
            background: black;
            width: 100%;
        }
        .center-text{
            text-align:center;
        }
        .splash{
            width: 85%;
            z-index:-50;
        }
        .ubicate-image{
            position:fixed;    
            display:flex;
            justify-content: center;
            align-items:center;
            width:100%;
            height:100%;
        }
        .ubication-for-decorates{
            position:fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
        }
        .decorate-up{
            position:absolute;
            top:0;
            right:0;
        }
        .decorate-down{
            position:absolute;
            bottom:0;
            left:0;
            transform: rotate(180deg);
        }
        .for-from{
            display:flex;
            flex-direction:column;
            gap:8px;
            margin-bottom:8px;
        }
        .table-item{
            display:grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        </style>
    </head>
    <body>
        <div class="ubication-for-decorates">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-up">
            <img src="${bluediamond3Src}" alt="Corner" class="decorate-down">
        </div>
        <div class="ubicate-image">
            <img src="${bluediamond4Src}" alt="Splash" class="splash">
        </div>
        <section class="invoice">
            <div class="invoice-header">
                <section class="logo">
                    <img src="${imageSrc}" alt="Logo" style="max-width:124px;">
                    <div>Tel.: 786 914 8230, email: bluediamond.eps@gmail.com</div>
                </section>
                <div class="we-are">
                    <div>The Best Pool Service in Miami</div>
                    <div>14623 SW 125 Place Miami FL 33186-7403</div>
                </div>
            </div>
            <div class="invoice-body">

                <div class="for-from" >
                    <div>Para : ${client.name}</div>
                    <div>De : Blue Diamond Pool Service</div>
                </div>


                <div>Estimado Cliente:</div>

                <div>
                    El motivo de la presente es para informarle de su estado de cuenta en nuestra Empresa, 
                    hace falta que revise estos Invoice que por nuestra cuenta no se han pagado:
                </div>

                <div style="font-weight:900">A continuación, le reflejamos el Invoice:</div>

                <div class="table">
                ${
                    mappedOldInvoices.map(inv=> `<div class="table-item"><div style="font-weight:900">${inv.month}-${inv.year}</div><div style="font-weight:900">INV-${inv.invoiceId.toString().padStart(6,'0')}</div><div style="font-weight:900" class="description">$${inv.amount}</div></div>`)
                }
                </div>
                <div>
                    En el invoice correspondiente al mes de ${lastMonth} INV-${lastId.toString().padStart(6,'0')}, le reflejamos los 
                    meses pendientes, en total usted le debe a la Empresa $${amount}.
                </div>

                <div>
                    De antemano mostramos nuestras disculpas si esto pudiera causarle alguna incomodidad 
                    y agradecer como siempre su comprensión.
                </div>

                <div>
                    Agradecemos la oportunidad de trabajar con usted y poder brindarle un servicio de 
                    piscina de excelente calidad
                </div>

                <div class="footer">
                    <p>Saludos Cordiales</p>
                    <div>Jesús Reyes</div>
                    <div>DIRECTOR</div>
                    <div>BLUE DIAMOND POOL SERV</div>
                </div>
            </div>
        </section>
    </body>
    </html>`
}