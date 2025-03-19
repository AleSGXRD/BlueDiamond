import { Test, TestingModule } from '@nestjs/testing';
import { GenerateInvoiceService } from './generate-invoice.service';

describe('GenerateInvoiceService', () => {
  let service: GenerateInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateInvoiceService],
    }).compile();

    service = module.get<GenerateInvoiceService>(GenerateInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
