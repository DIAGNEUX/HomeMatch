import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    url: string;
    annonceId: string;
    publicId?: string | null;
  }): Promise<Image> {
    return this.prisma.image.create({
      data,
    });
  }

  countByAnnonceId(annonceId: string): Promise<number> {
    return this.prisma.image.count({ where: { annonceId } });
  }

  findById(id: string): Promise<Image | null> {
    return this.prisma.image.findUnique({ where: { id } });
  }

  delete(id: string): Promise<Image> {
    return this.prisma.image.delete({ where: { id } });
  }
}
