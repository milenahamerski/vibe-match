import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosService } from './favoritos.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('FavoritosService', () => {
  let service: FavoritosService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    content: {
      findUnique: jest.fn(),
    },
    favorite: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FavoritosService>(FavoritosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('favoritar', () => {
    it('deve favoritar um conteúdo com sucesso', async () => {
      const userId = 'user-1';
      const contentId = 'content-1';

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.content.findUnique.mockResolvedValue({ id: 'content-1' });
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue({ id: 'fav-1', userId, contentId });

      const result = await service.favoritar(userId, contentId);
      expect(result).toBeDefined();
      expect(result.contentId).toBe(contentId);
      expect(mockPrismaService.favorite.create).toHaveBeenCalled();
    });

    it('deve lançar ConflictException se o conteúdo já for favorito do usuário', async () => {
      const userId = 'user-1';
      const contentId = 'content-1';

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.content.findUnique.mockResolvedValue({ id: 'content-1' });
      mockPrismaService.favorite.findUnique.mockResolvedValue({ id: 'fav-existing' });

      await expect(service.favoritar(userId, contentId)).rejects.toThrow(ConflictException);
    });
  });

  describe('desfavoritar', () => {
    it('deve desfavoritar um conteúdo', async () => {
      const userId = 'user-1';
      const contentId = 'content-1';

      mockPrismaService.favorite.findUnique.mockResolvedValue({ id: 'fav-1', userId, contentId });
      mockPrismaService.favorite.delete.mockResolvedValue({ id: 'fav-1' });

      const result = await service.desfavoritar(userId, contentId);
      expect(result).toBeDefined();
      expect(mockPrismaService.favorite.delete).toHaveBeenCalled();
    });
  });
});
