import { IsIn, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DetailsDto } from './details.dto';

export class CreateConteudoDto {
  @IsString({ message: 'O título deve ser uma string válida.' })
  title: string;

  @IsString({ message: 'O tipo deve ser uma string válida.' })
  @IsIn(['filme', 'série', 'livro'], { message: 'O tipo deve ser filme, série ou livro.' })
  type: 'filme' | 'série' | 'livro';

  @IsString({ message: 'O gênero deve ser uma string válida.' })
  genre: string;

  @IsInt({ message: 'A nota (rating) deve ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  @Type(() => Number)
  rating: number;

  @ValidateNested({ message: 'Os detalhes devem ser um objeto válido.' })
  @Type(() => DetailsDto)
  details: DetailsDto;
}
