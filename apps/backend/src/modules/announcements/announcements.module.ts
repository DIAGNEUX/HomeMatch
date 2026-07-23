import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsRepository } from './repositories/announcements.repository';
import { AgenciesModule } from '../agencies/agencies.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { ImagesRepository } from './images/repositories/images.repository';

@Module({
  imports: [AgenciesModule],
  controllers: [AnnouncementsController, ImagesController],
  providers: [AnnouncementsService, AnnouncementsRepository, ImagesService, ImagesRepository],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}