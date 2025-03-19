import { Test, TestingModule } from '@nestjs/testing';
import { SenderMailsService } from './sender-mails.service';

describe('SenderMailsService', () => {
  let service: SenderMailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SenderMailsService],
    }).compile();

    service = module.get<SenderMailsService>(SenderMailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
