import { PartialType } from '@nestjs/mapped-types';
import { CreateUseraccountDto } from './create-useraccount.dto';

export class UpdateUseraccountDto extends PartialType(CreateUseraccountDto) {
    rolId?:number;
    name?:string;
    password?:string;
}
