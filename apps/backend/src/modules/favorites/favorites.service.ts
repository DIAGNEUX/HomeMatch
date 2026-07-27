import { Injectable } from '@nestjs/common';
import { AnnouncementsService } from '../announcements/announcements.service';
import {
  FavoritesRepository,
  FavoriteWithAnnonce,
} from './repositories/favorites.repository';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly announcementsService: AnnouncementsService,
  ) {}

  async add(
    userId: string,
    announcementId: string,
  ): Promise<FavoriteWithAnnonce> {
    await this.announcementsService.findPublicAnnonce(announcementId);

    const existing =
      await this.favoritesRepository.findByUserAndAnnouncement(
        userId,
        announcementId,
      );

    if (existing) {
      return existing;
    }

    return this.favoritesRepository.create(userId, announcementId);
  }

  async remove(userId: string, announcementId: string): Promise<void> {
    await this.favoritesRepository.deleteByUserAndAnnouncement(
      userId,
      announcementId,
    );
  }

  findMine(userId: string): Promise<FavoriteWithAnnonce[]> {
    return this.favoritesRepository.findByUser(userId);
  }

  async getStatus(
    userId: string,
    announcementId: string,
  ): Promise<{ isFavorite: boolean }> {
    const favorite = await this.favoritesRepository.findByUserAndAnnouncement(
      userId,
      announcementId,
    );

    return {
      isFavorite: !!favorite,
    };
  }
}
