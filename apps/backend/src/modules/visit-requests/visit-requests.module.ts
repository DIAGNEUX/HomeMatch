import { Module } from '@nestjs/common';
import { AgenciesModule } from '../agencies/agencies.module';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { VisitRequestsController } from './visit-requests.controller';
import { VisitRequestsService } from './visit-requests.service';
import { VisitRequestsRepository } from './repositories/visit-requests.repository';

@Module({
  imports: [AgenciesModule, AnnouncementsModule],
  controllers: [VisitRequestsController],
  providers: [VisitRequestsService, VisitRequestsRepository],
  exports: [VisitRequestsService],
})
export class VisitRequestsModule {}
