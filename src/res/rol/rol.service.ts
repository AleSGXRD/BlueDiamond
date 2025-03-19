import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolService {
  
    /**
     *
     */
    constructor(@InjectRepository(Rol) private RolRepository:Repository<Rol> ) {
    }

    getItems() : Promise<Rol[]>{
        return this.RolRepository.find();
    }

    async getItem(id:number): Promise<Rol | HttpException>{
        const userFounded = this.RolRepository.findOne({
            where: {
                rolId:id
            }
        })
        if(!userFounded)
            return new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
        else 
            return userFounded
    }

    async createItem(Rol:CreateRolDto) : Promise<Rol | HttpException>{

        const userFound = await this.RolRepository.findOne({
            where: {
                name: Rol.name
            }
        })

        if(userFound){
            return new HttpException('Item already exists', HttpStatus.CONFLICT);
        }

        const newRol = this.RolRepository.create(Rol);
        return this.RolRepository.save(newRol);
    }

    async updateItem(id:number, Rol:UpdateRolDto){
        const result = await this.RolRepository.update({ rolId:id }, Rol)
        if(result.affected === 0)
            return new HttpException("Item don't found", HttpStatus.NOT_FOUND)

        return result
    }

    async deleteItem(id:number){
      const result = await this.RolRepository.delete({ rolId:id })
      if( result.affected == 0)
          return new HttpException("Item don't found", HttpStatus.NOT_FOUND)
      else
          return result
    }
}
