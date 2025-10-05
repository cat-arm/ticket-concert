/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let prismaService: PrismaService;

  const mockConcert = {
    id: '1',
    name: 'Test Concert',
    description: 'Test Description',
    totalSeats: 100,
    createdAt: new Date(),
  };

  const mockCreateConcertDto = {
    name: 'Test Concert',
    description: 'Test Description',
    totalSeats: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ConcertsService>(ConcertsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      jest
        .spyOn(prismaService.concert, 'create')
        .mockResolvedValue(mockConcert);

      const result = await service.create(mockCreateConcertDto);

      expect(prismaService.concert.create).toHaveBeenCalledWith({
        data: mockCreateConcertDto,
      });
      expect(result).toEqual(mockConcert);
    });
  });

  describe('findAll', () => {
    it('should return all concerts', async () => {
      const mockConcerts = [mockConcert];
      jest
        .spyOn(prismaService.concert, 'findMany')
        .mockResolvedValue(mockConcerts);

      const result = await service.findAll();

      expect(prismaService.concert.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockConcerts);
    });
  });

  describe('remove', () => {
    it('should remove a concert', async () => {
      jest
        .spyOn(prismaService.concert, 'findUnique')
        .mockResolvedValue(mockConcert);
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            },
            concert: {
              delete: jest.fn().mockResolvedValue(mockConcert),
            },
          };
          return callback(tx as any);
        });

      const result = await service.remove('1');

      expect(prismaService.concert.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual({ ok: true });
    });

    it('should throw NotFoundException when concert not found', async () => {
      jest.spyOn(prismaService.concert, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('stats', () => {
    it('should return concert statistics', async () => {
      const mockStats = [
        { _sum: { totalSeats: 100 } },
        50, // reserved count
        10, // cancelled count
      ];

      jest.spyOn(prismaService, '$transaction').mockResolvedValue(mockStats);

      const result = await service.stats();

      expect(result).toEqual({
        totalSeats: 100,
        reserve: 50,
        cancel: 10,
      });
    });
  });
});
