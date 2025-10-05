/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
    createdAt: new Date(),
  };

  const mockCreateUserDto = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: mockCreateUserDto,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('toggleAdmin', () => {
    it('should toggle admin status from false to true', async () => {
      const updatedUser = { ...mockUser, isAdmin: true };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.toggleAdmin('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isAdmin: true },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should toggle admin status from true to false', async () => {
      const adminUser = { ...mockUser, isAdmin: true };
      const updatedUser = { ...mockUser, isAdmin: false };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(adminUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.toggleAdmin('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isAdmin: false },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.toggleAdmin('1')).rejects.toThrow(NotFoundException);
    });
  });
});
