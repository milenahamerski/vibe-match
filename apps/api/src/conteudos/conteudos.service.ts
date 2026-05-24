import { Injectable, NotFoundException } from '@nestjs/common';
import { Conteudo } from './interfaces/conteudo.interface';

@Injectable()
export class ConteudosService {
  private items: Conteudo[] = [];

  create(item: Omit<Conteudo, 'id'>) {
    const newItem: Conteudo = {
      id: this.items.length + 1,
      ...item,
    };
    this.items.push(newItem);
    return newItem;
  }

  findAll(filter?: string, page: number = 1): Conteudo[] {
    let result = this.items;

    if (filter) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.genre.toLowerCase().includes(filter.toLowerCase())
      );
    }

    const pageSize = 5;
    return result.slice((page - 1) * pageSize, page * pageSize);
  }

  findOne(id: number) {
    const item = this.items.find((item) => item.id === id);
    if (!item) throw new NotFoundException('Conteúdo não encontrado');
    return item;
  }

  update(id: number, data: Partial<Conteudo>) {
    const item = this.findOne(id);
    Object.assign(item, data);
    return item;
  }

  remove(id: number) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Conteúdo não encontrado');
    this.items.splice(index, 1);
  }
}
