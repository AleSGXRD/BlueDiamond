import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryClientDto } from './dto/create-history-client.dto';
import { UpdateHistoryClientDto } from './dto/update-history-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryClient } from './entities/history-client.entity';
import { Repository } from 'typeorm';
import { ClientService } from '../client/client.service';

@Injectable()
export class HistoryClientService {

  constructor(@InjectRepository(HistoryClient) private repositoryHistoryClient : Repository<HistoryClient>,
              @Inject(forwardRef(()=> ClientService))
              private readonly clientService : ClientService) {    
  }

  async createHistory(createHistoryClientDto: CreateHistoryClientDto) {
    if(createHistoryClientDto.date == undefined){
      createHistoryClientDto.date = new Date()
    }
    // esta a proposito, porque hace falta asi
    const createHistoryClient = this.repositoryHistoryClient.create(createHistoryClientDto); 
    const savedHistoryClient = await this.repositoryHistoryClient.save(createHistoryClient);

    return savedHistoryClient 
  }

  async create(createHistoryClientDto: CreateHistoryClientDto) {
    const itemFound = await this.clientService.getItem(createHistoryClientDto.clientId);
    if(!itemFound)
      throw new HttpException("User don't exists", HttpStatus.NOT_FOUND);

    const { active } = createHistoryClientDto
    if(!active){
      const updatedClient = await this.clientService.updateItem(itemFound.clientId, {offerApproved : false, offerSended : false})
    }

    return this.createHistory(createHistoryClientDto);
  }

  findAll() {
    return this.repositoryHistoryClient.find();
  }

  async findOne(id: number,date : Date) {
    const item = await this.repositoryHistoryClient.findOne({
      where: {
        clientId: id,
        date: date
      }
    });
    if(!item)
      throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);
    
    return item
  }

  async lastEntrance(id:number){
    const items = await this.repositoryHistoryClient.find({
      where:
      {
        clientId: id
      }
    })
    if(items.length == 0)
      throw new HttpException("Don't exists histories about the client", HttpStatus.NOT_FOUND);

    const itemsSorted = items.sort((a,b) => a.date.getTime() - b.date.getTime())
    console.log('historias ordenadas: ',itemsSorted)

    const lastIndex = itemsSorted.length - 1;
    if(itemsSorted[lastIndex].active == false)
      throw new HttpException("This user is inactive", HttpStatus.BAD_REQUEST)
    
    return itemsSorted[lastIndex];
  }

  async update(id: number,date : Date, updateHistoryClientDto: UpdateHistoryClientDto) {
    const item = await this.repositoryHistoryClient.findOne({
      where: {
        clientId: id,
        date: date
      }
    });
    if(!item)
      throw new HttpException("Item don't exists", HttpStatus.NOT_FOUND);

    return this.repositoryHistoryClient.update({clientId : id, date : date}, updateHistoryClientDto);
  }

  async remove(id: number, date : Date) {
    const result = await this.repositoryHistoryClient.delete({clientId: id, date:date});
    if(result.affected === 0)
      throw new HttpException('Item not Found', HttpStatus.NOT_FOUND);

    return result
  }
}
