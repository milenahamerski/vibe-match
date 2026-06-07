import { Test, TestingModule } from '@nestjs/testing';
import { ListasController } from './listas.controller';
import { ListasService } from './listas.service';

describe('ListasController', () => {
  let controller: ListasController;
  let service: ListasService;

  const mockListasService = {
    criar: jest.fn(),
    adicionarItem: jest.fn(),
    removerItem: jest.fn(),
    buscarPorUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListasController],
      providers: [
        { provide: ListasService, useValue: mockListasService },
      ],
    }).compile();

    controller = module.get<ListasController>(ListasController);
    service = module.get<ListasService>(ListasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('should create a lista', async () => {
      const dto = { userId: '1', name: 'My List', description: 'Test' };
      mockListasService.criar.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.criar(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.criar).toHaveBeenCalledWith(dto);
    });
  });

  describe('adicionarItem', () => {
    it('should add item to lista', async () => {
      const dto = { contentId: '1' };
      mockListasService.adicionarItem.mockResolvedValue({ id: '1' });

      const result = await controller.adicionarItem('list1', dto);
      expect(result).toEqual({ id: '1' });
      expect(service.adicionarItem).toHaveBeenCalledWith('list1', '1');
    });
  });

  describe('removerItem', () => {
    it('should remove item from lista', async () => {
      mockListasService.removerItem.mockResolvedValue({ id: '1' });

      const result = await controller.removerItem('list1', '1');
      expect(result).toEqual({ id: '1' });
      expect(service.removerItem).toHaveBeenCalledWith('list1', '1');
    });
  });

  describe('buscarPorUsuario', () => {
    it('should find listas by user', async () => {
      const listas = [{ id: '1', title: 'List' }];
      mockListasService.buscarPorUsuario.mockResolvedValue(listas);

      const result = await controller.buscarPorUsuario('1');
      expect(result).toEqual(listas);
      expect(service.buscarPorUsuario).toHaveBeenCalledWith('1');
    });
  });
});
