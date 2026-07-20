import { Injectable } from '@nestjs/common';
import { AnnouncementsRepository } from './repositories/announcements.repository';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { Annonce } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly announcementsRepository: AnnouncementsRepository) {}

  async createAnnonce(dto: CreateAnnonceDto, agencyId: string): Promise<Annonce> {
    return this.announcementsRepository.create(dto, agencyId);
  }
}