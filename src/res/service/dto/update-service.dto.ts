import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    manyMonths?:number;
    permanent?:boolean;
    active?:boolean;
    quantity?: number;
    estimateCreated?:boolean;
    finished?:boolean;
    discount?: number;
}
