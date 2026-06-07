import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email: string;

  @ApiProperty({
    example: 'Milena Hamerski',
    description: 'Nome completo do usuário',
  })
  @IsString({ message: 'O nome deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha de acesso (mínimo de 6 caracteres)',
  })
  @IsString({ message: 'A senha deve ser uma string válida.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @ApiProperty({
    example: 21,
    description: 'Idade opcional do usuário',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'A idade deve ser um número inteiro.' })
  @Min(0, { message: 'A idade não pode ser negativa.' })
  @Type(() => Number)
  age?: number;
}
