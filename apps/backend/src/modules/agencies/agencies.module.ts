import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { AgencyRepository } from './repositories/agencies.repository';


@Module({
  controllers: [AgenciesController],
  providers: [
    AgenciesService,
    AgencyRepository,
  ],
  exports: [AgenciesService],
})
export class AgenciesModule {}