import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AnnouncementsRepository,
  AnnonceSearchFilters,
} from './repositories/announcements.repository';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { SearchAnnonceDto } from './dto/search-annonce.dto';
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

  private readonly requiredFields: (keyof Annonce)[] = [
    'titre',
    'description',
    'typeAnnonce',
    'typeBien',
    'prix',
    'surface',
    'nombrePieces',
    'nombreSallesBains',
    'nombreChambres',
    'adresse',
    'ville',
  ];

  private checkCanPublish(annonce: Annonce): void {
    const missingFields = this.requiredFields.filter(
      (field) => annonce[field] === null || annonce[field] === undefined,
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Impossible de publier : champs manquants (${missingFields.join(', ')}).`,
      );
    }
  }

  async publishAnnonce(id: string, agencyId: string): Promise<Annonce> {
    const annonce = await this.getAnnonceOrThrow(id);
    this.checkOwnership(annonce, agencyId);
    this.checkCanPublish(annonce);

    return this.announcementsRepository.updateStatut(id, 'PUBLIEE');
  }

  async findAllAnnonces(): Promise<Annonce[]> {
    return this.announcementsRepository.findAll();
  }

  async findOneAnnonce(id: string): Promise<Annonce> {
    return this.getAnnonceOrThrow(id);
  }

  async findByAgency(agencyId: string): Promise<Annonce[]> {
    return this.announcementsRepository.findByAgency(agencyId);
  }

  async searchPublicAnnonces(
    filters: SearchAnnonceDto,
  ): Promise<{ data: Annonce[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.announcementsRepository.searchPublic(
      filters,
    );

    return {
      data,
      total,
      page: filters.page ?? 1,
      limit: filters.limit ?? 12,
    };
  }

  async searchAnnonces(filters: AnnonceSearchFilters): Promise<Annonce[]> {
    return this.announcementsRepository.search(filters);
  }

  async findPublicAnnonce(id: string): Promise<Annonce> {
    const annonce = await this.getAnnonceOrThrow(id);
  
    if (annonce.statut !== 'PUBLIEE') {
      throw new NotFoundException('Annonce introuvable.');
    }
  
    return annonce;
  }
  
}