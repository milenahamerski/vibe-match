import { IsInt, IsString, Max, Min } from 'class-validator';

export class DetailsDto {
  @IsString({ message: 'O diretor deve ser uma string válida.' })
  director: string;

  @IsInt({ message: 'O ano de lançamento deve ser um número inteiro.' })
  @Min(1800, { message: 'O ano de lançamento não pode ser anterior a 1800.' })
  @Max(new Date().getFullYear() + 5, { message: 'O ano de lançamento inválido.' })
  releaseYear: number;
}
