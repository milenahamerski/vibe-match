import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryFilterDto {
  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Termo de filtro para buscar nos campos de título e gênero',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O filtro deve ser uma string válida.' })
  @Transform(({ value }: { value: string }) => value?.trim())
  filter?: string;

  @ApiProperty({
    example: 1,
    description: 'Número da página para paginação',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number;
}
