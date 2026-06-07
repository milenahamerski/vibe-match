import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CriarListaDto {
  @ApiProperty({ description: 'ID do usuário proprietário da lista', example: 'user-uuid-123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Nome da lista', example: 'Minhas Séries Favoritas' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
