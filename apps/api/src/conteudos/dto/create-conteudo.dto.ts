import { IsIn, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DetailsDto } from './details.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConteudoDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Título do conteúdo (filme, série ou livro)',
  })
  @IsString({ message: 'O título deve ser uma string válida.' })
  title: string;

  @ApiProperty({
    example: 'filme',
    description: 'Tipo do conteúdo',
    enum: ['filme', 'série', 'livro'],
  })
  @IsString({ message: 'O tipo deve ser uma string válida.' })
  @IsIn(['filme', 'série', 'livro'], { message: 'O tipo deve ser filme, série ou livro.' })
  type: 'filme' | 'série' | 'livro';

  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Gênero do conteúdo',
  })
  @IsString({ message: 'O gênero deve ser uma string válida.' })
  genre: string;

  @ApiProperty({
    example: 5,
    description: 'Nota/avaliação do conteúdo (de 1 a 5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'A nota (rating) deve ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    type: () => DetailsDto,
    description: 'Detalhes específicos do conteúdo (ex: duração, autor, diretor)',
  })
  @ValidateNested({ message: 'Os detalhes devem ser um objeto válido.' })
  @Type(() => DetailsDto)
  details: DetailsDto;
}
