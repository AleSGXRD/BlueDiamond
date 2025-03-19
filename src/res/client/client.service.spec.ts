import { Test, TestingModule } from "@nestjs/testing";
import { ClientService } from "./client.service";
import { Client } from "./client.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoryClient } from "src/res/history-client/entities/history-client.entity";
import { HistoryClientService } from "src/res/history-client/history-client.service";


describe('PService', () => {
    let service: ClientService;
    let clientRepository: Repository<Client>;
    let historyRepository: Repository<HistoryClient>;
    let historyService: HistoryClientService;
  
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            ClientService,
            {
              provide: getRepositoryToken(Client),
              useClass: Repository,
            },
            {
              provide: getRepositoryToken(HistoryClient),
              useClass: Repository,
            },
            {
              provide: HistoryClientService,
              useValue: {
                createHistory: jest.fn(),
              },
            },
          ],
        }).compile();
    
        service = module.get<ClientService>(ClientService);
        clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
        historyRepository = module.get<Repository<HistoryClient>>(getRepositoryToken(HistoryClient));
        historyService = module.get<HistoryClientService>(HistoryClientService);
      });
  
      describe('getItems', () => {
        it('should return an array of clients', async () => {
          const clients: Client[] = [{ clientId: 1, name: 'Test Client', histories: [] } as Client];
          jest.spyOn(clientRepository, 'find').mockResolvedValue(clients);
    
          const result = await service.getItems();
          expect(result).toEqual(clients);
          expect(clientRepository.find).toHaveBeenCalledWith({ relations: ['histories'] });
        });
      });
  });
  