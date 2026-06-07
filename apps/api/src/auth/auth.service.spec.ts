import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: UsuariosService;
  let jwtService: JwtService;

  const mockUsuariosService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: mockUsuariosService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuariosService = module.get<UsuariosService>(UsuariosService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@test.com', password: '123', name: 'Test' };
      mockUsuariosService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.register(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(usuariosService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'notfound@test.com', password: '123' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue({ id: '1', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token if login is successful', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed', roles: ['USER'] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token_abc');

      const result = await service.login({ email: 'test@test.com', password: 'correct' });
      expect(result).toEqual({ access_token: 'token_abc' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: '1', email: 'test@test.com', roles: ['USER'] });
    });
  });
});
