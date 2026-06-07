import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CriarFavoritoDto } from './dto/criar-favorito.dto';
import { LimiteFavoritosExcedidoException } from './exceptions/limite-favoritos-excedido.exception';
import { OfertaPremiumFilter } from './filters/oferta-premium.filter';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('favoritos')
@Controller('favoritos')
@UseFilters(OfertaPremiumFilter) // Filtro aplicado a nível de classe
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adiciona um conteúdo aos favoritos' })
  @ApiResponse({ status: 201, description: 'Favorito adicionado com sucesso.' })
  async favoritar(@Body() dto: CriarFavoritoDto) {
    return this.favoritosService.favoritar(dto.userId, dto.contentId);
  }

  @Delete('usuario/:userId/conteudo/:contentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um conteúdo dos favoritos' })
  @ApiResponse({ status: 200, description: 'Favorito removido com sucesso.' })
  async desfavoritar(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ) {
    return this.favoritosService.desfavoritar(userId, contentId);
  }

  @Get('real/usuario/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém a lista real de favoritos do banco de dados' })
  async buscarFavoritosReal(@Param('userId') userId: string) {
    return this.favoritosService.buscarPorUsuario(userId);
  }

  // --- Endpoints de Demonstração / Legado ---

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Obtém a lista de itens favoritados de um usuário específico (Mock)' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: '1' })
  @ApiResponse({ status: 200, description: 'Favoritos obtidos com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  obterFavoritosPorUsuario(@Param('id') id: string) {
    if (id !== '1') {
      throw new NotFoundException(
        `Usuário com ID '${id}' não foi localizado em nossa base do VibeMatch.`,
      );
    }

    return {
      usuarioId: id,
      categoria: 'Vibe Matching Principal',
      itensFavoritados: [
        { id: 101, titulo: 'Lofi Chill Vibes', tipo: 'Musica' },
        { id: 102, titulo: 'Synthwave Nightride', tipo: 'Musica' },
        { id: 103, titulo: 'Cyberpunk 2077 OST', tipo: 'Album' },
      ],
    };
  }

  @Get('admin')
  @ApiOperation({ summary: 'Obtém o painel administrativo de favoritos globais (lança exceção de teste)' })
  @ApiResponse({ status: 401, description: 'Acesso negado: Você não possui privilégios de Administrador.' })
  obterAdminDashboard() {
    throw new UnauthorizedException(
      'Acesso negado: Você não possui privilégios de Administrador para gerenciar os favoritos globais.',
    );
  }

  @Get('adicionar/:total')
  @ApiOperation({ summary: 'Adiciona múltiplos itens favoritos de uma só vez (com validação de limite)' })
  @ApiParam({ name: 'total', description: 'Número total de favoritos a adicionar', example: 2 })
  @ApiResponse({ status: 200, description: 'Itens favoritados com sucesso.' })
  @ApiResponse({ status: 400, description: 'Limite de favoritos excedido (máximo 3). Se total >= 5, redireciona pelo filtro Premium.' })
  adicionarMultiplosFavoritos(@Param('total', ParseIntPipe) total: number) {
    const LIMITE_MAXIMO = 3;

    if (total > LIMITE_MAXIMO) {
      throw new LimiteFavoritosExcedidoException(LIMITE_MAXIMO, total);
    }

    return {
      sucesso: true,
      mensagem: `Vibes favoritadas com sucesso! Você adicionou ${total} itens na sua lista.`,
      limiteRestante: LIMITE_MAXIMO - total,
    };
  }
}
