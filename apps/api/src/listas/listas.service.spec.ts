import { Test, TestingModule } from '@nestjs/testing';
import { ListasService } from './listas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ListasService', () => {
  let service: ListasService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    list: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    listItem: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListasService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ListasService>(ListasService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarLista', () => {
    it('deve criar uma nova lista', async () => {
      const dto = { userId: 'user-1', name: 'Favoritos da Madrugada' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.list.create.mockResolvedValue({ id: 'list-1', ...dto });

      const result = await service.criar(dto);
      expect(result).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(mockPrismaService.list.create).toHaveBeenCalled();
    });
  });
});
