import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { PrismaService } from '../prisma.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        ConcertsService,
        {
          provide: PrismaService,
          useValue: {
            concert: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
              aggregate: jest.fn(),
            },
            reservation: {
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
