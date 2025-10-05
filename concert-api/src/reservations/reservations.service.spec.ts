/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Reservation } from '@prisma/client';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prismaService: PrismaService;

  const mockReservation = {
    id: '1',
    sessionId: 'session1',
    concertId: 'concert1',
    status: 'RESERVED',
    createdAt: new Date(),
  };

  const mockConcert = {
    id: 'concert1',
    name: 'Test Concert',
    description: 'Test Description',
    totalSeats: 100,
    createdAt: new Date(),
  };

  const mockCreateReservationDto = {
    sessionId: 'session1',
    concertId: 'concert1',
  };

  const mockCancelReservationDto = {
    sessionId: 'session1',
    concertId: 'concert1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ReservationsService>(ReservationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const mockReservations = [mockReservation];
      jest
        .spyOn(prismaService.reservation, 'findMany')
        .mockResolvedValue(mockReservations as Reservation[]);

      const result = await service.findAll();

      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        include: { concert: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockReservations);
    });
  });

  describe('findBySession', () => {
    it('should return reservations for a specific session', async () => {
      const sessionId = 'session1';
      const mockReservations = [mockReservation];
      jest
        .spyOn(prismaService.reservation, 'findMany')
        .mockResolvedValue(mockReservations as Reservation[]);

      const result = await service.findBySession(sessionId);

      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { sessionId },
        include: { concert: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockReservations);
    });
  });

  describe('reserve', () => {
    it('should create a reservation', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              findUnique: jest.fn().mockResolvedValue(null),
              count: jest.fn().mockResolvedValue(50),
              create: jest.fn().mockResolvedValue(mockReservation),
            },
            concert: {
              findUnique: jest.fn().mockResolvedValue(mockConcert),
            },
          };
          return callback(tx as any);
        });

      const result = await service.reserve(mockCreateReservationDto);

      expect(result).toEqual(mockReservation);
    });

    it('should throw BadRequestException when user already reserved', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              findUnique: jest.fn().mockResolvedValue(mockReservation), // status: 'RESERVED'
              count: jest.fn(),
              create: jest.fn(),
            },
            concert: {
              findUnique: jest.fn(),
            },
          };
          return callback(tx as any);
        });

      await expect(service.reserve(mockCreateReservationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user already has any reservation', async () => {
      const cancelledReservation = { ...mockReservation, status: 'CANCELLED' };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              findUnique: jest.fn().mockResolvedValue(cancelledReservation), // status: 'CANCELLED'
              count: jest.fn(),
              create: jest.fn(),
            },
            concert: {
              findUnique: jest.fn(),
            },
          };
          return callback(tx as any);
        });

      await expect(service.reserve(mockCreateReservationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when concert not found', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              findUnique: jest.fn().mockResolvedValue(null),
              count: jest.fn(),
              create: jest.fn(),
            },
            concert: {
              findUnique: jest.fn().mockResolvedValue(null),
            },
          };
          return callback(tx as any);
        });

      await expect(service.reserve(mockCreateReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when no seats available', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const tx = {
            reservation: {
              findUnique: jest.fn().mockResolvedValue(null),
              count: jest.fn().mockResolvedValue(100), // All seats taken
              create: jest.fn(),
            },
            concert: {
              findUnique: jest.fn().mockResolvedValue(mockConcert),
            },
          };
          return callback(tx as any);
        });

      await expect(service.reserve(mockCreateReservationDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const cancelledReservation = { ...mockReservation, status: 'CANCELLED' };
      jest
        .spyOn(prismaService.reservation, 'findUnique')
        .mockResolvedValue(mockReservation as Reservation);
      jest
        .spyOn(prismaService.reservation, 'update')
        .mockResolvedValue(cancelledReservation as Reservation);

      const result = await service.cancel(mockCancelReservationDto);

      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: {
          sessionId_concertId: { sessionId: 'session1', concertId: 'concert1' },
        },
      });
      expect(prismaService.reservation.update).toHaveBeenCalledWith({
        where: {
          sessionId_concertId: { sessionId: 'session1', concertId: 'concert1' },
        },
        data: { status: 'CANCELLED' },
      });
      expect(result).toEqual(cancelledReservation);
    });

    it('should return existing reservation if already cancelled', async () => {
      const cancelledReservation = { ...mockReservation, status: 'CANCELLED' };
      jest
        .spyOn(prismaService.reservation, 'findUnique')
        .mockResolvedValue(cancelledReservation as Reservation);

      const result = await service.cancel(mockCancelReservationDto);

      expect(result).toEqual(cancelledReservation as Reservation);
    });

    it('should throw NotFoundException when reservation not found', async () => {
      jest
        .spyOn(prismaService.reservation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.cancel(mockCancelReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
