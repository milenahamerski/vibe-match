import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CriarFavoritoDto {
  @ApiProperty({ description: 'ID do usuário', example: 'user-uuid-123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID do conteúdo a ser favoritado', example: 'content-uuid-456' })
  @IsNotEmpty()
  @IsString()
  contentId: string;
}
