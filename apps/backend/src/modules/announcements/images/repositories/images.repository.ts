import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(url: string, annonceId: string): Promise<Image> {
    return this.prisma.image.create({
      data: { url, annonceId },
    });
  }

  findById(id: string): Promise<Image | null> {
    return this.prisma.image.findUnique({ where: { id } });
  }

  delete(id: string): Promise<Image> {
    return this.prisma.image.delete({ where: { id } });
  }
}