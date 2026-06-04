import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUsuarioDto,
        password: hashedPassword,
      },
    });

    delete (user as any).password;
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      delete (user as any).password;
      return user;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    delete (user as any).password;
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
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

    const updateData = { ...updateUsuarioDto };
    if (updateUsuarioDto.password) {
      updateData.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    delete (user as any).password;
    return user;
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    delete (user as any).password;
    return user;
  }
}
