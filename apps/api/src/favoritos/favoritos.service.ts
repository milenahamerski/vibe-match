import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritosService {
  constructor(private readonly prisma: PrismaService) {}

  async favoritar(userId: string, contentId: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const contentExists = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!contentExists) {
      throw new NotFoundException('Conteúdo não encontrado.');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Este conteúdo já está nos favoritos.');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        contentId,
      },
    });
  }

  async desfavoritar(userId: string, contentId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Conteúdo favoritado não encontrado.');
    }

    return this.prisma.favorite.delete({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });
  }

  async buscarPorUsuario(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { content: true },
    });
  }
}
