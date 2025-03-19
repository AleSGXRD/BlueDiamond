import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Useraccount } from 'src/res/useraccount/entities/useraccount.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PasswordService } from './service/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    /**
     *
     */
    constructor(@InjectRepository(Useraccount) private useraccountRepository: Repository<Useraccount>,
                private passwordService : PasswordService,
                private readonly jwtService : JwtService) {
    }

    async login(login : LoginAuthDto){
        let userFound : Useraccount = await this.useraccountRepository.findOne({
            where:{
                name: login.name
            }
        })
        if(!userFound)
            throw new HttpException('User credentials incorrect', HttpStatus.BAD_REQUEST)

        const accepted = await this.passwordService.comparePassword(login.password, userFound.password)
        if(!accepted)
            throw new HttpException('User credentials incorrect', HttpStatus.NOT_ACCEPTABLE)
 
        const payload = {id : userFound.userId, name: userFound.name}
        const token = this.jwtService.sign(payload);

        const data ={
            payload,
            token
        }
        return data
    }
}
