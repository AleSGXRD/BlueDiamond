import { Module } from '@nestjs/common';
import { UseraccountService } from './useraccount.service';
import { UseraccountController } from './useraccount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Useraccount } from './entities/useraccount.entity';
import { Rol } from '../rol/entities/rol.entity';
import { PasswordService } from 'src/auth/service/password.service';

@Module({
  imports:[TypeOrmModule.forFeature([Useraccount,Rol])],
  controllers: [UseraccountController],
  providers: [UseraccountService,PasswordService],
})
export class UseraccountModule {}
