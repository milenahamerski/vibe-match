import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacoesService } from './avaliacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('AvaliacoesService', () => {
  let service: AvaliacoesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    content: {
      findUnique: jest.fn(),
    },
    review: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvaliacoesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AvaliacoesService>(AvaliacoesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarAvaliacao', () => {
    it('deve criar uma avaliação com nota entre 1 e 5', async () => {
      const dto = { userId: 'user-1', contentId: 'content-1', rating: 4, comment: 'Muito bom!' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.content.findUnique.mockResolvedValue({ id: 'content-1' });
      mockPrismaService.review.findUnique.mockResolvedValue(null);
      mockPrismaService.review.create.mockResolvedValue({ id: 'review-1', ...dto });

      const result = await service.criar(dto);
      expect(result).toBeDefined();
      expect(result.rating).toBe(4);
      expect(mockPrismaService.review.create).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a nota for menor que 1 ou maior que 5', async () => {
      const dtoLow = { userId: 'user-1', contentId: 'content-1', rating: 0 };
      const dtoHigh = { userId: 'user-1', contentId: 'content-1', rating: 6 };

      await expect(service.criar(dtoLow)).rejects.toThrow(BadRequestException);
      await expect(service.criar(dtoHigh)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar ConflictException se o usuário já avaliou este conteúdo (RN02)', async () => {
      const dto = { userId: 'user-1', contentId: 'content-1', rating: 5 };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.content.findUnique.mockResolvedValue({ id: 'content-1' });
      mockPrismaService.review.findUnique.mockResolvedValue({ id: 'existing-review' });

      await expect(service.criar(dto)).rejects.toThrow(ConflictException);
    });
  });
});
