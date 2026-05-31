import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string válida.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
