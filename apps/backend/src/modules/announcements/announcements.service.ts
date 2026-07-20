import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnnouncementsRepository } from './repositories/announcements.repository';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { Annonce } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly announcementsRepository: AnnouncementsRepository) {}

  async createAnnonce(dto: CreateAnnonceDto, agencyId: string): Promise<Annonce> {
    return this.announcementsRepository.create(dto, agencyId);
  }

  private async getAnnonceOrThrow(id: string): Promise<Annonce> {
    const annonce = await this.announcementsRepository.findById(id);

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable.');
    }

    return annonce;
  }

  private checkOwnership(annonce: Annonce, agencyId: string): void {
    if (annonce.agencyId !== agencyId) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette annonce.",
      );
    }
  }

  async updateAnnonce(
    id: string,
    dto: UpdateAnnonceDto,
    agencyId: string,
  ): Promise<Annonce> {
    const annonce = await this.getAnnonceOrThrow(id);
    this.checkOwnership(annonce, agencyId);

    return this.announcementsRepository.update(id, dto);
  }

  async deleteAnnonce(id: string, agencyId: string): Promise<Annonce> {
    const annonce = await this.getAnnonceOrThrow(id);
    this.checkOwnership(annonce, agencyId);

    return this.announcementsRepository.delete(id);
  }

  async findAllAnnonces(): Promise<Annonce[]> {
    return this.announcementsRepository.findAll();
  }
  
  async findOneAnnonce(id: string): Promise<Annonce> {
    return this.getAnnonceOrThrow(id);
  }
  
}