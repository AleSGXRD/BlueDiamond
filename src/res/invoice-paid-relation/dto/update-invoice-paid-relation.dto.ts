import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoicePaidRelationDto } from './create-invoice-paid-relation.dto';

export class UpdateInvoicePaidRelationDto extends PartialType(CreateInvoicePaidRelationDto) {}
