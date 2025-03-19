import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePaidRelationController } from './invoice-paid-relation.controller';
import { InvoicePaidRelationService } from './invoice-paid-relation.service';

describe('InvoicePaidRelationController', () => {
  let controller: InvoicePaidRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicePaidRelationController],
      providers: [InvoicePaidRelationService],
    }).compile();

    controller = module.get<InvoicePaidRelationController>(InvoicePaidRelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
