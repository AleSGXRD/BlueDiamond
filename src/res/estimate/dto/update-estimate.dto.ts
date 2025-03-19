import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimateDto } from './create-estimate.dto';

export class UpdateEstimateDto extends PartialType(CreateEstimateDto) {
    itemName?:string;
    serviceDate?:Date;
    estimateApproved?:boolean;
    estimateDate?:Date;
    quantity?:number;
    price?:number;
}
