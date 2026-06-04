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

@Controller('conteudos')
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateConteudoDto) {
    return this.conteudosService.create(body);
  }

  @Get()
  findAll(@Query() queryFilter: QueryFilterDto) {
    return this.conteudosService.findAll(queryFilter.filter, queryFilter.page);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conteudosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateConteudoDto>) {
    return this.conteudosService.update(id, body as Partial<Conteudo>);
  }

  @Patch(':id')
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateConteudoDto>) {
    return this.conteudosService.update(id, body as Partial<Conteudo>);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.conteudosService.remove(id);
  }
}
