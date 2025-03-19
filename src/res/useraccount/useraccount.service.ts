import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateUseraccountDto } from './dto/create-useraccount.dto';
import { UpdateUseraccountDto } from './dto/update-useraccount.dto';
import { Useraccount } from './entities/useraccount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from 'src/auth/service/password.service';

@Injectable()
export class UseraccountService implements OnApplicationBootstrap {
  
    /**
     *
     */
    constructor(@InjectRepository(Useraccount) private UseraccountRepository:Repository<Useraccount>,
                private passwordService:PasswordService ) {
    }

    async onApplicationBootstrap(){
        const userAccounts = await this.getItems();
        if(userAccounts.length == 0){
            const newUser : CreateUseraccountDto ={
                name: "Admin",
                password: "123123",
                rolId : 1
            }
            const result = await this.createItem(newUser);
            console.log('Primer usuario inicializado: ' + result.name + ", contraseña: 123123.")
        }
    }

    getItems() : Promise<Useraccount[]>{
        return this.UseraccountRepository.find(
            {
                relations: ['rol']
            }
        );
    }

    async getItem(id:number): Promise<Useraccount | HttpException>{
        const userFounded = this.UseraccountRepository.findOne({
            where: {
                userId:id
            }
        })
        if(!userFounded)
            return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else 
            return userFounded
    }

    async createItem(Useraccount:CreateUseraccountDto) : Promise<Useraccount | HttpException>{

        const userFound = await this.UseraccountRepository.findOne({
            where: {
                name: Useraccount.name
            }
        })

        if(userFound){
            return new HttpException('Item already exists', HttpStatus.CONFLICT);
        }

        const newUser = {...Useraccount, password: await this.passwordService.hashPassword(Useraccount.password)}

        const newUseraccount = this.UseraccountRepository.create(newUser);
        return this.UseraccountRepository.save(newUseraccount);
    }

    async updateItem(id:number, Useraccount:UpdateUseraccountDto){
        if(Useraccount.password != undefined){
            Useraccount = {...Useraccount, password: await this.passwordService.hashPassword(Useraccount.password)}
        }
        
        const result = await this.UseraccountRepository.update({ userId:id }, Useraccount)
        if(result.affected === 0)
            return new HttpException("Item don't found", HttpStatus.NOT_FOUND)

        return result
    }

    async deleteItem(id:number){
      const result = await this.UseraccountRepository.delete({ userId:id })
      if( result.affected == 0)
          return new HttpException("Item don't found", HttpStatus.NOT_FOUND)
      else
          return result
    }

}
