import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  review: {
    findMany: jest.fn(),
  },
  favorite: {
    findMany: jest.fn(),
  },
};

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
      await expect(service.create({ email: 'test@test.com', password: '123', name: 'Test' })).rejects.toThrow(ConflictException);
    });

    it('should create a new user with hashed password and delete it from return', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrismaService.user.create.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed_password', name: 'Test' });

      const result = await service.create({ email: 'test@test.com', password: '123', name: 'Test' });
      
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@test.com');
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'test@test.com', password: 'hashed_password', name: 'Test' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([
        { id: '1', email: 'user1@test.com', password: 'pwd' },
        { id: '2', email: 'user2@test.com', password: 'pwd' },
      ]);

      const result = await service.findAll();
      expect(result.length).toBe(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return a user without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'pwd' });
      const result = await service.findOne('1');
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('1');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'pwd' });
      const result = await service.findByEmail('test@test.com');
      expect(result!.email).toBe('test@test.com');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.update('1', { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email is taken by another user', async () => {
      // First findOne call returns the current user
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'old@test.com' });
      // Second findUnique call (for email check) returns another user
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '2', email: 'new@test.com' });

      await expect(service.update('1', { email: 'new@test.com' })).rejects.toThrow(ConflictException);
    });

    it('should update and return user without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'old@test.com' });
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null); // email not taken
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hash');
      
      mockPrismaService.user.update.mockResolvedValue({ id: '1', name: 'New Name', password: 'new_hash' });

      const result = await service.update('1', { name: 'New Name', password: 'new_password' });
      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('New Name');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should remove user and return it without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'test@test.com' });
      mockPrismaService.user.delete.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'pwd' });

      const result = await service.remove('1');
      expect(result).not.toHaveProperty('password');
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('obterHistorico', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.obterHistorico('1')).rejects.toThrow(NotFoundException);
    });

    it('should return user reviews and favorites', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '1' });
      mockPrismaService.review.findMany.mockResolvedValue([{ id: 'r1' }]);
      mockPrismaService.favorite.findMany.mockResolvedValue([{ id: 'f1' }]);

      const result = await service.obterHistorico('1');
      expect(result.reviews.length).toBe(1);
      expect(result.favorites.length).toBe(1);
    });
  });
});
