import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existing) {
      throw new ConflictException('Um usuário com este e-mail já existe.');
    }

    return this.prisma.user.create({
      data: createUsuarioDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

    if (updateUsuarioDto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUsuarioDto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Este e-mail já está em uso por outro usuário.');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUsuarioDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
