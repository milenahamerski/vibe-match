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
  ParseIntPipe,
} from '@nestjs/common';
import { ConteudosService } from './conteudos.service';
import type { Conteudo } from './interfaces/conteudo.interface';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
    return this.conteudosService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os conteúdos cadastrados com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de conteúdos retornada com sucesso.' })
  findAll(@Query() queryFilter: QueryFilterDto) {
    return this.conteudosService.findAll(queryFilter.filter, queryFilter.page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um conteúdo por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico do conteúdo', example: 1 })
  @ApiResponse({ status: 200, description: 'Conteúdo retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conteudosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza completamente um conteúdo' })
  @ApiParam({ name: 'id', description: 'ID numérico do conteúdo', example: 1 })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateConteudoDto) {
    return this.conteudosService.update(id, body as Partial<Conteudo>);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente um conteúdo' })
  @ApiParam({ name: 'id', description: 'ID numérico do conteúdo', example: 1 })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateConteudoDto>) {
    return this.conteudosService.update(id, body as Partial<Conteudo>);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta um conteúdo pelo ID' })
  @ApiParam({ name: 'id', description: 'ID numérico do conteúdo', example: 1 })
  @ApiResponse({ status: 204, description: 'Conteúdo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.conteudosService.remove(id);
  }
}
