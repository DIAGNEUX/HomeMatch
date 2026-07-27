import { Module } from '@nestjs/common';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './repositories/favorites.repository';

@Module({
  imports: [AnnouncementsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
  exports: [FavoritesService],
})
export class FavoritesModule {}
