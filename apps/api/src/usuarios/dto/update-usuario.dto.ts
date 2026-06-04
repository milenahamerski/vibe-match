import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiProperty({
    example: 'novo_usuario@example.com',
    description: 'Novo e-mail do usuário',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email?: string;

  @ApiProperty({
    example: 'Novo Nome do Usuário',
    description: 'Novo nome completo do usuário',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name?: string;

  @ApiProperty({
    example: 'novaSenhaSegura123',
    description: 'Nova senha de acesso (mínimo de 6 caracteres)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string válida.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password?: string;

  @ApiProperty({
    example: 22,
    description: 'Nova idade do usuário',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'A idade deve ser um número inteiro.' })
  @Min(0, { message: 'A idade não pode ser negativa.' })
  @Type(() => Number)
  age?: number;
}
