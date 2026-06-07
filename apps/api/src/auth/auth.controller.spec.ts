import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@test.com', password: '123', name: 'Test' };
      mockAuthService.register.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.register(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login and return access token', async () => {
      const dto = { email: 'test@test.com', password: '123' };
      mockAuthService.login.mockResolvedValue({ access_token: 'token_abc' });

      const result = await controller.login(dto);
      expect(result).toEqual({ access_token: 'token_abc' });
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPerfil', () => {
    it('should return user profile from request', async () => {
      const req = { user: { userId: '1', email: 'test@test.com' } };
      const result = await controller.getPerfil(req);
      expect(result).toEqual({
        message: 'Você acessou uma rota protegida!',
        user: req.user,
      });
    });
  });
});
