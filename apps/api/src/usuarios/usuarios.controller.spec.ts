import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockUsuariosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    obterHistorico: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        { provide: UsuariosService, useValue: mockUsuariosService },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = { email: 'test@test.com', password: '123', name: 'Test' };
      mockUsuariosService.create.mockResolvedValue({ id: '1', ...createDto });

      const result = await controller.create(createDto);
      expect(result).toEqual({ id: '1', ...createDto });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', name: 'Test1' }, { id: '2', name: 'Test2' }];
      mockUsuariosService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', name: 'Test' };
      mockUsuariosService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated' };
      const updatedUser = { id: '1', name: 'Updated' };
      mockUsuariosService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a user', async () => {
      const updateDto = { name: 'Partially Updated' };
      const updatedUser = { id: '1', name: 'Partially Updated' };
      mockUsuariosService.update.mockResolvedValue(updatedUser);

      const result = await controller.partialUpdate('1', updateDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsuariosService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('obterHistorico', () => {
    it('should get user history', async () => {
      const history = { reviews: [], favorites: [] };
      mockUsuariosService.obterHistorico.mockResolvedValue(history);

      const result = await controller.obterHistorico('1');
      expect(result).toEqual(history);
      expect(service.obterHistorico).toHaveBeenCalledWith('1');
    });
  });
});
