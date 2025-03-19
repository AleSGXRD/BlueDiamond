import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePaidRelationService } from './invoice-paid-relation.service';

describe('InvoicePaidRelationService', () => {
  let service: InvoicePaidRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicePaidRelationService],
    }).compile();

    service = module.get<InvoicePaidRelationService>(InvoicePaidRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
