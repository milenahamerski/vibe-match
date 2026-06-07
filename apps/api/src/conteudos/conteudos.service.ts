import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConteudosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; type: string; genre: string }) {
    return this.prisma.content.create({
      data: {
        title: data.title,
        type: data.type,
        genre: data.genre,
      },
    });
  }

  async findAll(filter?: string, page: number = 1) {
    const pageSize = 10;
    const whereClause: any = {};

    if (filter) {
      whereClause.OR = [
        { title: { contains: filter, mode: 'insensitive' } },
        { genre: { contains: filter, mode: 'insensitive' } },
        { type: { contains: filter, mode: 'insensitive' } },
      ];
    }

    return this.prisma.content.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.content.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Conteúdo não encontrado');
    return item;
  }

  async update(id: string, data: { title?: string; type?: string; genre?: string }) {
    await this.findOne(id);
    return this.prisma.content.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.content.delete({
      where: { id },
    });
  }

  // US02 & US03 - Recomendação de Humor
  async recomendarPorHumor(mood: string) {
    // Mapeamento simples de humor para gênero
    let genres: string[] = [];
    const lowerMood = mood.toLowerCase();
    if (lowerMood === 'feliz' || lowerMood === 'animado') {
      genres = ['Comédia', 'Sci-Fi', 'Ação', 'Comedy'];
    } else if (lowerMood === 'triste' || lowerMood === 'melancolico') {
      genres = ['Drama', 'Romance'];
    } else {
      genres = ['Suspense', 'Terror', 'Documentário', 'Sci-Fi'];
    }

    return this.prisma.content.findMany({
      where: {
        genre: { in: genres, mode: 'insensitive' },
      },
      take: 5,
    });
  }

  // US09 - Recomendação Baseada em Avaliações
  async recomendarPorAvaliacoes(userId: string) {
    // Buscar avaliações do usuário com nota >= 4
    const positiveReviews = await this.prisma.review.findMany({
      where: {
        userId,
        rating: { gte: 4 },
      },
      include: {
        content: true,
      },
    });

    if (positiveReviews.length === 0) {
      // Sem histórico de avaliações positivas, retornar qualquer conteúdo
      return this.prisma.content.findMany({ take: 5 });
    }

    // Filtra reviews que possam ter content null (caso de inconsistência no banco)
    const validReviews = positiveReviews.filter((r) => r.content != null);

    if (validReviews.length === 0) {
      return this.prisma.content.findMany({ take: 5 });
    }

    const preferredGenres = Array.from(
      new Set(validReviews.map((r) => r.content.genre)),
    );

    const evaluatedContentIds = validReviews.map((r) => r.contentId);

    // Recomendar conteúdos do mesmo gênero que o usuário ainda não avaliou
    return this.prisma.content.findMany({
      where: {
        genre: { in: preferredGenres },
        id: { notIn: evaluatedContentIds },
      },
      take: 5,
    });
  }
}
