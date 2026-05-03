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
import { ConteudosService } from './conteudos.service';
import type { Conteudo } from './interfaces/conteudo.interface';

@Controller('conteudos')
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: Conteudo) {
    return this.conteudosService.create(body);
  }

  @Get()
  findAll() {
    return this.conteudosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conteudosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Conteudo>) {
    return this.conteudosService.update(id, body);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() body: Partial<Conteudo>) {
    return this.conteudosService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.conteudosService.remove(id);
  }
}
