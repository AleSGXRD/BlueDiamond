import { Module } from '@nestjs/common';
import { PdfGeneratorController } from './pdf-generator.controller';

@Module({
    controllers: [PdfGeneratorController],
    providers: [],
})
export class PdfGeneratorModule {}
