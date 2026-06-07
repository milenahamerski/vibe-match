import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários cadastrados' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID UUID do usuário', example: 'ca08dd5e-a2f0-448b-8270-30a824ec6875' })
  @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza todos os dados de um usuário' })
  @ApiParam({ name: 'id', description: 'ID UUID do usuário', example: 'ca08dd5e-a2f0-448b-8270-30a824ec6875' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'E-mail já está em uso por outro usuário.' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente os dados de um usuário' })
  @ApiParam({ name: 'id', description: 'ID UUID do usuário', example: 'ca08dd5e-a2f0-448b-8270-30a824ec6875' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'E-mail já está em uso por outro usuário.' })
  partialUpdate(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID UUID do usuário', example: 'ca08dd5e-a2f0-448b-8270-30a824ec6875' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso (sem conteúdo de retorno).' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async remove(@Param('id') id: string) {
    await this.usuariosService.remove(id);
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Obtém o histórico de interações do usuário (avaliações e favoritos)' })
  @ApiParam({ name: 'id', description: 'ID UUID do usuário', example: 'ca08dd5e-a2f0-448b-8270-30a824ec6875' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  obterHistorico(@Param('id') id: string) {
    return this.usuariosService.obterHistorico(id);
  }
}
