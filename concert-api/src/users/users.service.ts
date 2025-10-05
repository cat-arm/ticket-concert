import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async toggleAdmin(id: string) {
    const current = await this.prisma.user.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('User not found');
    if (current.isAdmin) {
      return this.prisma.user.update({
        where: { id },
        data: { isAdmin: false },
      });
    }
    return this.prisma.user.update({ where: { id }, data: { isAdmin: true } });
  }
}
