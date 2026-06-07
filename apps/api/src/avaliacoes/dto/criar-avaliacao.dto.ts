import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CriarAvaliacaoDto {
  @ApiProperty({ description: 'ID do usuário', example: 'user-uuid-123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID do conteúdo avaliado', example: 'content-uuid-456' })
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty({ description: 'Nota de 1 a 5', example: 5 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário opcional sobre o conteúdo', example: 'Excelente!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
