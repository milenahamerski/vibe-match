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

@Controller('favoritos')
@UseFilters(OfertaPremiumFilter) // Filtro aplicado a nível de classe
export class FavoritosController {
  
  @Get('usuario/:id')
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
  obterAdminDashboard() {
    throw new UnauthorizedException(
      'Acesso negado: Você não possui privilégios de Administrador para gerenciar os favoritos globais.',
    );
  }

  @Get('adicionar/:total')
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
