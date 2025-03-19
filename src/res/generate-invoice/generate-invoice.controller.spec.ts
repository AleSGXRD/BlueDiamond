import { Test, TestingModule } from '@nestjs/testing';
import { GenerateInvoiceController } from './generate-invoice.controller';
import { GenerateInvoiceService } from './generate-invoice.service';

describe('GenerateInvoiceController', () => {
  let controller: GenerateInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateInvoiceController],
      providers: [GenerateInvoiceService],
    }).compile();

    controller = module.get<GenerateInvoiceController>(GenerateInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
