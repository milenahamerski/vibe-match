import { Test, TestingModule } from '@nestjs/testing';
import { ConteudosService } from './conteudos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  content: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  review: {
    findMany: jest.fn(),
  },
};

describe('ConteudosService', () => {
  let service: ConteudosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConteudosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ConteudosService>(ConteudosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a content', async () => {
      const data = { title: 'Test', type: 'Movie', genre: 'Ação' };
      mockPrismaService.content.create.mockResolvedValue({ id: '1', ...data });

      const result = await service.create(data);
      expect(result).toEqual({ id: '1', ...data });
    });
  });

  describe('findAll', () => {
    it('should find all contents without filter', async () => {
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);
      
      const result = await service.findAll();
      expect(result.length).toBe(1);
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 100,
      });
    });

    it('should find all contents with filter', async () => {
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);
      
      await service.findAll('Test', 2);
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'Test', mode: 'insensitive' } },
            { genre: { contains: 'Test', mode: 'insensitive' } },
            { type: { contains: 'Test', mode: 'insensitive' } },
          ]
        },
        skip: 100,
        take: 100,
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if content not found', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return a content', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue({ id: '1' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if content not found', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue(null);
      await expect(service.update('1', { title: 'New' })).rejects.toThrow(NotFoundException);
    });

    it('should update and return content', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.content.update.mockResolvedValue({ id: '1', title: 'New' });

      const result = await service.update('1', { title: 'New' });
      expect(result.title).toBe('New');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if content not found', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should delete and return content', async () => {
      mockPrismaService.content.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.content.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');
      expect(result.id).toBe('1');
    });
  });

  describe('recomendarPorHumor', () => {
    it('should return energetic genres', async () => {
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);
      await service.recomendarPorHumor('energetic');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { genre: { in: ['Action', 'Comedy'], mode: 'insensitive' } }
      }));
    });

    it('should return chill genres', async () => {
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);
      await service.recomendarPorHumor('chill');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { genre: { in: ['Comedy', 'Documentary', 'Romance'], mode: 'insensitive' } }
      }));
    });

    it('should return default genres for other moods', async () => {
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);
      await service.recomendarPorHumor('Other');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { genre: { in: ['Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Horror', 'Thriller', 'Documentary'], mode: 'insensitive' } }
      }));
    });
  });

  describe('recomendarPorAvaliacoes', () => {
    it('should return random content if no positive reviews', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([]);
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);

      await service.recomendarPorAvaliacoes('1');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({ take: 5 });
    });

    it('should return random content if no valid reviews with content', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([{ content: null }]);
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '1' }]);

      await service.recomendarPorAvaliacoes('1');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({ take: 5 });
    });

    it('should recommend content based on preferred genres', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([
        { contentId: 'c1', content: { genre: 'Ação' } }
      ]);
      mockPrismaService.content.findMany.mockResolvedValue([{ id: '2' }]);

      await service.recomendarPorAvaliacoes('1');
      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          genre: { in: ['Ação'] },
          id: { notIn: ['c1'] },
        },
        take: 5,
      });
    });
  });
});
