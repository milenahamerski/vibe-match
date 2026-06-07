import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário cadastrado',
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  @IsString({ message: 'A senha deve ser uma string válida.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
