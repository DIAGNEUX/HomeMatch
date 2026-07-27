import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

const favoriteInclude = {
  annonce: {
    include: {
      images: true,
      agency: true,
    },
  },
} satisfies Prisma.FavoriteInclude;

export type FavoriteWithAnnonce = Prisma.FavoriteGetPayload<{
  include: typeof favoriteInclude;
}>;

@Injectable()
export class FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, announcementId: string): Promise<FavoriteWithAnnonce> {
    return this.prisma.favorite.create({
      data: {
        userId,
        annonceId: announcementId,
      },
      include: favoriteInclude,
    });
  }

  findByUserAndAnnouncement(
    userId: string,
    announcementId: string,
  ): Promise<FavoriteWithAnnonce | null> {
    return this.prisma.favorite.findUnique({
      where: {
        userId_annonceId: {
          userId,
          annonceId: announcementId,
        },
      },
      include: favoriteInclude,
    });
  }

  findByUser(userId: string): Promise<FavoriteWithAnnonce[]> {
    return this.prisma.favorite.findMany({
      where: {
        userId,
        annonce: {
          statut: 'PUBLIEE',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: favoriteInclude,
    });
  }

  async deleteByUserAndAnnouncement(
    userId: string,
    announcementId: string,
  ): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: {
        userId,
        annonceId: announcementId,
      },
    });
  }
}
