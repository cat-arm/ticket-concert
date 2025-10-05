import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService, PrismaService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
