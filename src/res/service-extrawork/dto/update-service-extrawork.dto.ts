import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceExtraworkDto } from './create-service-extrawork.dto';

export class UpdateServiceExtraworkDto extends PartialType(CreateServiceExtraworkDto) {
    quantity?: number;
}
