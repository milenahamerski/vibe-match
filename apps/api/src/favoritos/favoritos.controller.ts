import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { LimiteFavoritosExcedidoException } from './exceptions/limite-favoritos-excedido.exception';
import { OfertaPremiumFilter } from './filters/oferta-premium.filter';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('favoritos')
@Controller('favoritos')
@UseFilters(OfertaPremiumFilter) // Filtro aplicado a nível de classe
export class FavoritosController {
  
  @Get('usuario/:id')
  @ApiOperation({ summary: 'Obtém a lista de itens favoritados de um usuário específico' })
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
