/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservation = {
    id: '1',
    sessionId: 'session1',
    concertId: 'concert1',
    status: 'RESERVED' as const,
    createdAt: new Date(),
    concert: {
      id: 'concert1',
      name: 'Test Concert',
      description: 'Test Description',
      totalSeats: 100,
      createdAt: new Date(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            concert: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findBySession', () => {
    it('should return reservations for a specific session', async () => {
      const sessionId = 'session1';
      const mockReservations = [mockReservation];
      jest
        .spyOn(service, 'findBySession')
        .mockResolvedValue(mockReservations as any);

      const result = await controller.findBySession(sessionId);

      expect(service.findBySession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(mockReservations);
    });
  });
});
