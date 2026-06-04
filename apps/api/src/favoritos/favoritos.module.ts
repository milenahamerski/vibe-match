import { Module } from '@nestjs/common';
import { FavoritosController } from './favoritos.controller';

@Module({
  controllers: [FavoritosController],
})
export class FavoritosModule {}
