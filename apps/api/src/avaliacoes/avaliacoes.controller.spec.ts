import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacoesController } from './avaliacoes.controller';
import { AvaliacoesService } from './avaliacoes.service';

describe('AvaliacoesController', () => {
  let controller: AvaliacoesController;
  let service: AvaliacoesService;

  const mockAvaliacoesService = {
    criar: jest.fn(),
    buscarPorConteudo: jest.fn(),
    buscarPorUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacoesController],
      providers: [
        { provide: AvaliacoesService, useValue: mockAvaliacoesService },
      ],
    }).compile();

    controller = module.get<AvaliacoesController>(AvaliacoesController);
    service = module.get<AvaliacoesService>(AvaliacoesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('should create an avaliacao', async () => {
      const dto = { userId: '1', contentId: '1', rating: 5, comment: 'Bom' };
      mockAvaliacoesService.criar.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.criar(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.criar).toHaveBeenCalledWith(dto);
    });
  });

  describe('buscarPorConteudo', () => {
    it('should find avaliacoes by content', async () => {
      const avaliacoes = [{ id: '1', rating: 5 }];
      mockAvaliacoesService.buscarPorConteudo.mockResolvedValue(avaliacoes);

      const result = await controller.buscarPorConteudo('1');
      expect(result).toEqual(avaliacoes);
      expect(service.buscarPorConteudo).toHaveBeenCalledWith('1');
    });
  });

  describe('buscarPorUsuario', () => {
    it('should find avaliacoes by user', async () => {
      const avaliacoes = [{ id: '1', rating: 5 }];
      mockAvaliacoesService.buscarPorUsuario.mockResolvedValue(avaliacoes);

      const result = await controller.buscarPorUsuario('1');
      expect(result).toEqual(avaliacoes);
      expect(service.buscarPorUsuario).toHaveBeenCalledWith('1');
    });
  });
});
