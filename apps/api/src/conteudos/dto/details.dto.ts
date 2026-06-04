import { IsInt, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetailsDto {
  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Diretor do filme/série ou autor do livro',
  })
  @IsString({ message: 'O diretor deve ser uma string válida.' })
  director: string;

  @ApiProperty({
    example: 2010,
    description: 'Ano de lançamento do conteúdo',
  })
  @IsInt({ message: 'O ano de lançamento deve ser um número inteiro.' })
  @Min(1800, { message: 'O ano de lançamento não pode ser anterior a 1800.' })
  @Max(new Date().getFullYear() + 5, { message: 'O ano de lançamento inválido.' })
  releaseYear: number;
}
