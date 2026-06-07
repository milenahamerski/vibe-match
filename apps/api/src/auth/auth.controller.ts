import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login com email e senha' })
  @ApiBody({
    type: LoginDto,
    examples: {
      sucesso: {
        summary: 'Exemplo de login com sucesso',
        value: { email: 'joao@email.com', password: 'senhaSegura123' },
      },
      erro_email: {
        summary: 'Exemplo com e-mail inválido',
        value: { email: 'joao_sem_arroba', password: 'senhaSegura123' },
      },
      erro_senha: {
        summary: 'Exemplo com senha curta',
        value: { email: 'joao@email.com', password: '123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login com sucesso. Retorna access_token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('perfil')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna os dados do perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Retorna dados do perfil com sucesso.' })
  @ApiResponse({ status: 401, description: 'Acesso não autorizado devido a token ausente ou inválido.' })
  async getPerfil(@Req() req) {
    return {
      message: 'Você acessou uma rota protegida!',
      user: req.user,
    };
  }
}
