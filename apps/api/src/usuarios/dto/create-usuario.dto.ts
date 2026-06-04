import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email: string;

  @IsString({ message: 'O nome deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @IsString({ message: 'A senha deve ser uma string válida.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsInt({ message: 'A idade deve ser um número inteiro.' })
  @Min(0, { message: 'A idade não pode ser negativa.' })
  @Type(() => Number)
  age?: number;
}
