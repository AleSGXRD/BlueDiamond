import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt'

@Injectable()
export class PasswordService {
    private readonly saltRounds = 10; // Configura el número de rondas según lo necesario

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
