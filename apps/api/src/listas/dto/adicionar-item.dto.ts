import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdicionarItemDto {
  @ApiProperty({ description: 'ID do conteúdo a ser adicionado à lista', example: 'content-uuid-456' })
  @IsNotEmpty()
  @IsString()
  contentId: string;
}
