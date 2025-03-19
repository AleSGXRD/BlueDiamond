import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Useraccount } from 'src/res/useraccount/entities/useraccount.entity';
import { PasswordService } from './service/password.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Useraccount]), 
              JwtModule.register({
                global:true,
                secret: jwtConstants.secret ,
                signOptions: {expiresIn: '1d'}
              })],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
