import { Test, TestingModule } from '@nestjs/testing';
import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';

describe('ConteudosController', () => {
  let controller: ConteudosController;
  let service: ConteudosService;

  const mockConteudosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    recomendarPorHumor: jest.fn(),
    recomendarPorAvaliacoes: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConteudosController],
      providers: [
        { provide: ConteudosService, useValue: mockConteudosService },
      ],
    }).compile();

    controller = module.get<ConteudosController>(ConteudosController);
    service = module.get<ConteudosService>(ConteudosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a content', async () => {
      const createDto = { title: 'Test', type: 'Movie', genre: 'Ação' };
      mockConteudosService.create.mockResolvedValue({ id: '1', ...createDto });

      const result = await controller.create(createDto);
      expect(result).toEqual({ id: '1', ...createDto });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all contents', async () => {
      const contents = [{ id: '1', title: 'Test' }];
      mockConteudosService.findAll.mockResolvedValue(contents);

      const result = await controller.findAll({ filter: 'Test', page: 1 });
      expect(result).toEqual(contents);
      expect(service.findAll).toHaveBeenCalledWith('Test', 1);
    });
  });

  describe('recomendarPorHumor', () => {
    it('should recommend content by mood', async () => {
      const contents = [{ id: '1', title: 'Test' }];
      mockConteudosService.recomendarPorHumor.mockResolvedValue(contents);

      const result = await controller.recomendarPorHumor('Feliz');
      expect(result).toEqual(contents);
      expect(service.recomendarPorHumor).toHaveBeenCalledWith('Feliz');
    });
  });

  describe('recomendarPorAvaliacoes', () => {
    it('should recommend content by reviews', async () => {
      const contents = [{ id: '1', title: 'Test' }];
      mockConteudosService.recomendarPorAvaliacoes.mockResolvedValue(contents);

      const result = await controller.recomendarPorAvaliacoes('1');
      expect(result).toEqual(contents);
      expect(service.recomendarPorAvaliacoes).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a content by id', async () => {
      const content = { id: '1', title: 'Test' };
      mockConteudosService.findOne.mockResolvedValue(content);

      const result = await controller.findOne('1');
      expect(result).toEqual(content);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a content', async () => {
      const updateDto = { title: 'Updated', type: 'Movie', genre: 'Ação' };
      const updatedContent = { id: '1', ...updateDto };
      mockConteudosService.update.mockResolvedValue(updatedContent);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updatedContent);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a content', async () => {
      const updateDto = { title: 'Partially Updated' };
      const updatedContent = { id: '1', title: 'Partially Updated' };
      mockConteudosService.update.mockResolvedValue(updatedContent);

      const result = await controller.partialUpdate('1', updateDto);
      expect(result).toEqual(updatedContent);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a content', async () => {
      mockConteudosService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
