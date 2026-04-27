import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConteudosModule } from './conteudos/conteudos.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { ListasModule } from './listas/listas.module';
import { ItensListaModule } from './itens-lista/itens-lista.module';

@Module({
  imports: [
    DatabaseModule,
    UsuariosModule,
    ConteudosModule,
    AvaliacoesModule,
    FavoritosModule,
    ListasModule,
    ItensListaModule,
  ],
})
export class AppModule {}
