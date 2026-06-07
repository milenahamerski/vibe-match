import { Module } from '@nestjs/common';
import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConteudosController],
  providers: [ConteudosService],
  exports: [ConteudosService],
})
export class ConteudosModule {}
