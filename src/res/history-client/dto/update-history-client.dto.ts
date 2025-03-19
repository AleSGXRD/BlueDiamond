import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryClientDto } from './create-history-client.dto';

export class UpdateHistoryClientDto extends PartialType(CreateHistoryClientDto) {}
