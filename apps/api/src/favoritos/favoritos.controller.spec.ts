import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LimiteFavoritosExcedidoException } from './exceptions/limite-favoritos-excedido.exception';

describe('FavoritosController', () => {
  let controller: FavoritosController;
  let service: FavoritosService;

  const mockFavoritosService = {
    favoritar: jest.fn(),
    desfavoritar: jest.fn(),
    buscarPorUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritosController],
      providers: [
        { provide: FavoritosService, useValue: mockFavoritosService },
      ],
    }).compile();

    controller = module.get<FavoritosController>(FavoritosController);
    service = module.get<FavoritosService>(FavoritosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('favoritar', () => {
    it('should create a favorito', async () => {
      const dto = { userId: '1', contentId: '1' };
      mockFavoritosService.favoritar.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.favoritar(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.favoritar).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('desfavoritar', () => {
    it('should delete a favorito', async () => {
      mockFavoritosService.desfavoritar.mockResolvedValue({ id: '1' });

      const result = await controller.desfavoritar('1', '1');
      expect(result).toEqual({ id: '1' });
      expect(service.desfavoritar).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('buscarFavoritosReal', () => {
    it('should get real favoritos from database', async () => {
      const favoritos = [{ id: '1' }];
      mockFavoritosService.buscarPorUsuario.mockResolvedValue(favoritos);

      const result = await controller.buscarFavoritosReal('1');
      expect(result).toEqual(favoritos);
      expect(service.buscarPorUsuario).toHaveBeenCalledWith('1');
    });
  });

  describe('obterFavoritosPorUsuario', () => {
    it('should throw NotFoundException if id is not 1', () => {
      expect(() => controller.obterFavoritosPorUsuario('2')).toThrow(NotFoundException);
    });

    it('should return mock favoritos if id is 1', () => {
      const result = controller.obterFavoritosPorUsuario('1');
      expect(result.usuarioId).toBe('1');
      expect(result.itensFavoritados.length).toBe(3);
    });
  });

  describe('obterAdminDashboard', () => {
    it('should throw UnauthorizedException', () => {
      expect(() => controller.obterAdminDashboard()).toThrow(UnauthorizedException);
    });
  });

  describe('adicionarMultiplosFavoritos', () => {
    it('should throw LimiteFavoritosExcedidoException if total > 3', () => {
      expect(() => controller.adicionarMultiplosFavoritos(4)).toThrow(LimiteFavoritosExcedidoException);
    });

    it('should return success message if total <= 3', () => {
      const result = controller.adicionarMultiplosFavoritos(2);
      expect(result.sucesso).toBe(true);
      expect(result.limiteRestante).toBe(1);
    });
  });
});
