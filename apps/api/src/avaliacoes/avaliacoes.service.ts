import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';

@Injectable()
export class AvaliacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarAvaliacaoDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('A nota de avaliação deve estar entre 1 e 5.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const contentExists = await this.prisma.content.findUnique({
      where: { id: dto.contentId },
    });
    if (!contentExists) {
      throw new NotFoundException('Conteúdo não encontrado.');
    }

    const existing = await this.prisma.review.findUnique({
      where: {
        userId_contentId: {
          userId: dto.userId,
          contentId: dto.contentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Você já avaliou este conteúdo.');
    }

    return this.prisma.review.create({
      data: dto,
    });
  }

  async buscarPorConteudo(contentId: string) {
    return this.prisma.review.findMany({
      where: { contentId },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async buscarPorUsuario(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { content: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
