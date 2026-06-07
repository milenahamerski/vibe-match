import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ListasService } from './listas.service';
import { CriarListaDto } from './dto/criar-lista.dto';
import { AdicionarItemDto } from './dto/adicionar-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('listas')
@Controller('listas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListasController {
  constructor(private readonly listasService: ListasService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova lista personalizada para o usuário' })
  @ApiResponse({ status: 201, description: 'Lista criada com sucesso.' })
  async criar(@Body() dto: CriarListaDto) {
    return this.listasService.criar(dto);
  }

  @Post(':listId/itens')
  @ApiOperation({ summary: 'Adiciona um conteúdo a uma lista' })
  @ApiResponse({ status: 201, description: 'Item adicionado à lista com sucesso.' })
  async adicionarItem(
    @Param('listId') listId: string,
    @Body() dto: AdicionarItemDto,
  ) {
    return this.listasService.adicionarItem(listId, dto.contentId);
  }

  @Delete(':listId/itens/:contentId')
  @ApiOperation({ summary: 'Remove um conteúdo de uma lista' })
  @ApiResponse({ status: 200, description: 'Item removido da lista com sucesso.' })
  async removerItem(
    @Param('listId') listId: string,
    @Param('contentId') contentId: string,
  ) {
    return this.listasService.removerItem(listId, contentId);
  }

  @Get('usuario/:userId')
  @ApiOperation({ summary: 'Lista todas as listas de um usuário com seus itens' })
  @ApiResponse({ status: 200, description: 'Listas retornadas com sucesso.' })
  async buscarPorUsuario(@Param('userId') userId: string) {
    return this.listasService.buscarPorUsuario(userId);
  }
}
