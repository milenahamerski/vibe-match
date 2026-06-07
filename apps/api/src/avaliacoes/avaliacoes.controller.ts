import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AvaliacoesService } from './avaliacoes.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('avaliacoes')
@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma avaliação para um conteúdo' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Payload inválido ou nota fora do intervalo (1-5).' })
  @ApiResponse({ status: 409, description: 'Usuário já avaliou este conteúdo.' })
  async criar(@Body() dto: CriarAvaliacaoDto) {
    return this.avaliacoesService.criar(dto);
  }

  @Get('conteudo/:contentId')
  @ApiOperation({ summary: 'Lista avaliações por ID do conteúdo' })
  @ApiResponse({ status: 200, description: 'Avaliações recuperadas com sucesso.' })
  async buscarPorConteudo(@Param('contentId') contentId: string) {
    return this.avaliacoesService.buscarPorConteudo(contentId);
  }

  @Get('usuario/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista avaliações de um usuário' })
  @ApiResponse({ status: 200, description: 'Avaliações recuperadas com sucesso.' })
  async buscarPorUsuario(@Param('userId') userId: string) {
    return this.avaliacoesService.buscarPorUsuario(userId);
  }
}
