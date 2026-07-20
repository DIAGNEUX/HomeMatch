import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateAnnonceDto } from '../dto/create-annonce.dto';
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
}