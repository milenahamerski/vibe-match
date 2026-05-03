import { Injectable, NotFoundException } from '@nestjs/common';
import { Conteudo } from './interfaces/conteudo.interface';

@Injectable()
export class ConteudosService {
  private items: Conteudo[] = [];

  create(item: Conteudo) {
    this.items.push(item);
    return item;
  }

  findAll() {
    return this.items;
  }

  findOne(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (!item) throw new NotFoundException('Conteúdo não encontrado');
    return item;
  }

  update(id: string, data: Partial<Conteudo>) {
    const item = this.findOne(id);
    Object.assign(item, data);
    return item;
  }

  remove(id: string) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Conteúdo não encontrado');
    this.items.splice(index, 1);
  }
}
