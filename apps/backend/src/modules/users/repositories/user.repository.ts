import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}