import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarListaDto } from './dto/criar-lista.dto';

@Injectable()
export class ListasService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarListaDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.list.create({
      data: dto,
    });
  }

  async adicionarItem(listId: string, contentId: string) {
    const listExists = await this.prisma.list.findUnique({
      where: { id: listId },
    });
    if (!listExists) {
      throw new NotFoundException('Lista não encontrada.');
    }

    const contentExists = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!contentExists) {
      throw new NotFoundException('Conteúdo não encontrado.');
    }

    const existing = await this.prisma.listItem.findUnique({
      where: {
        listId_contentId: {
          listId,
          contentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Conteúdo já adicionado a esta lista.');
    }

    return this.prisma.listItem.create({
      data: {
        listId,
        contentId,
      },
    });
  }

  async removerItem(listId: string, contentId: string) {
    const existing = await this.prisma.listItem.findUnique({
      where: {
        listId_contentId: {
          listId,
          contentId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Item não encontrado na lista.');
    }

    return this.prisma.listItem.delete({
      where: {
        listId_contentId: {
          listId,
          contentId,
        },
      },
    });
  }

  async buscarPorUsuario(userId: string) {
    return this.prisma.list.findMany({
      where: { userId },
      include: {
        listItems: {
          include: {
            content: true,
          },
        },
      },
    });
  }
}
