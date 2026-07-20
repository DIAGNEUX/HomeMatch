import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateAnnonceDto } from '../dto/create-annonce.dto';
import { UpdateAnnonceDto } from '../dto/update-annonce.dto';
import { Annonce } from '@prisma/client';

@Injectable()
export class AnnouncementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAnnonceDto, agencyId: string): Promise<Annonce> {
    return this.prisma.annonce.create({
      data: {
        ...data,
        agencyId,
      },
    });
  }

  findById(id: string): Promise<Annonce | null> {
    return this.prisma.annonce.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateAnnonceDto): Promise<Annonce> {
    return this.prisma.annonce.update({
      where: { id },
      data,
    });
  }

  delete(id: string): Promise<Annonce> {
    return this.prisma.annonce.delete({
      where: { id },
    });
  }

  findAll(): Promise<Annonce[]> {
    return this.prisma.annonce.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
}