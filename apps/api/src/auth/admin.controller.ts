import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('ADMIN')
  getAdminData() {
    return { message: 'Bem-vindo, Admin!' };
  }

  // Rota para o desafio extra (apenas USER, mas acessível pelo ADMIN por conta do bypass)
  @Get('somente-usuario')
  @Roles('USER')
  getSomenteUsuarioData(@Req() req) {
    return {
      message: 'Você tem acesso como USER (ou ADMIN via bypass)!',
      user: req.user,
    };
  }
}
