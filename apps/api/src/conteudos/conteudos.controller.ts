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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConteudosService } from './conteudos.service';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('conteudos')
@Controller('conteudos')
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cadastra um novo conteúdo' })
  @ApiResponse({ status: 201, description: 'Conteúdo cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  create(@Body() body: CreateConteudoDto) {
    return this.conteudosService.create({
      title: body.title,
      type: body.type,
      genre: body.genre,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os conteúdos cadastrados com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de conteúdos retornada com sucesso.' })
  findAll(@Query() queryFilter: QueryFilterDto) {
    return this.conteudosService.findAll(queryFilter.filter, queryFilter.page);
  }

  @Get('recomendacoes/humor/:mood')
  @ApiOperation({ summary: 'Recomenda conteúdos com base no humor do usuário' })
  @ApiResponse({ status: 200, description: 'Recomendações geradas com sucesso.' })
  recomendarPorHumor(@Param('mood') mood: string) {
    return this.conteudosService.recomendarPorHumor(mood);
  }

  @Get('recomendacoes/usuario/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recomenda conteúdos com base no histórico de avaliações do usuário' })
  @ApiResponse({ status: 200, description: 'Recomendações geradas com sucesso.' })
  recomendarPorAvaliacoes(@Param('userId') userId: string) {
    return this.conteudosService.recomendarPorAvaliacoes(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um conteúdo por ID' })
  @ApiParam({ name: 'id', description: 'ID UUID do conteúdo', example: 'content-uuid-123' })
  @ApiResponse({ status: 200, description: 'Conteúdo retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.conteudosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza completamente um conteúdo' })
  @ApiParam({ name: 'id', description: 'ID UUID do conteúdo', example: 'content-uuid-123' })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  update(@Param('id') id: string, @Body() body: CreateConteudoDto) {
    return this.conteudosService.update(id, {
      title: body.title,
      type: body.type,
      genre: body.genre,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente um conteúdo' })
  @ApiParam({ name: 'id', description: 'ID UUID do conteúdo', example: 'content-uuid-123' })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  partialUpdate(@Param('id') id: string, @Body() body: Partial<CreateConteudoDto>) {
    return this.conteudosService.update(id, {
      title: body.title,
      type: body.type,
      genre: body.genre,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta um conteúdo pelo ID' })
  @ApiParam({ name: 'id', description: 'ID UUID do conteúdo', example: 'content-uuid-123' })
  @ApiResponse({ status: 204, description: 'Conteúdo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  async remove(@Param('id') id: string) {
    await this.conteudosService.remove(id);
  }
}
