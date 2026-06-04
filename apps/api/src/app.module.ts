import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConteudosModule } from './conteudos/conteudos.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { ListasModule } from './listas/listas.module';
import { ItensListaModule } from './itens-lista/itens-lista.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    PrismaModule,
    UsuariosModule,
    ConteudosModule,
    AvaliacoesModule,
    FavoritosModule,
    ListasModule,
    ItensListaModule,
    AuthModule,
  ],
})
export class AppModule {}
