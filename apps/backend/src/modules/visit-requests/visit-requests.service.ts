import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatutDemandeVisite as VisitRequestStatus } from '@prisma/client';
import { AnnouncementsService } from '../announcements/announcements.service';
import { CreateVisitRequestDto } from './dto/create-visit-request.dto';
import { UpdateVisitRequestStatusDto } from './dto/update-visit-request-status.dto';
import {
  VisitRequestsRepository,
  VisitRequestWithRelations,
} from './repositories/visit-requests.repository';

@Injectable()
export class VisitRequestsService {
  constructor(
    private readonly visitRequestsRepository: VisitRequestsRepository,
    private readonly announcementsService: AnnouncementsService,
  ) {}

  async create(
    announcementId: string,
    userId: string,
    dto: CreateVisitRequestDto,
  ): Promise<VisitRequestWithRelations> {
    await this.announcementsService.findPublicAnnonce(announcementId);

    const requestedVisitDate = new Date(dto.requestedVisitDate);

    if (requestedVisitDate <= new Date()) {
      throw new BadRequestException(
        'La date de visite souhaitee doit etre dans le futur.',
      );
    }

    const existing =
      await this.visitRequestsRepository.findActiveByAnnouncementAndUser(
        announcementId,
        userId,
      );

    if (existing) {
      throw new ConflictException(
        'Une demande de visite active existe deja pour cette annonce.',
      );
    }

    return this.visitRequestsRepository.create({
      announcementId,
      userId,
      requestedVisitDate,
      message: dto.message?.trim() ?? '',
    });
  }

  findByUser(userId: string): Promise<VisitRequestWithRelations[]> {
    return this.visitRequestsRepository.findByUser(userId);
  }

  findByAgency(agencyId: string): Promise<VisitRequestWithRelations[]> {
    return this.visitRequestsRepository.findByAgency(agencyId);
  }

  async updateStatus(
    id: string,
    agencyId: string,
    dto: UpdateVisitRequestStatusDto,
  ): Promise<VisitRequestWithRelations> {
    const visitRequest = await this.getVisitRequestOrThrow(id);
    this.checkAgencyOwnership(visitRequest, agencyId);

    if (visitRequest.statut === VisitRequestStatus.ANNULEE) {
      throw new BadRequestException(
        'Impossible de modifier une demande annulee.',
      );
    }

    return this.visitRequestsRepository.updateStatus(id, dto.status);
  }

  async cancel(
    id: string,
    userId: string,
  ): Promise<VisitRequestWithRelations> {
    const visitRequest = await this.getVisitRequestOrThrow(id);

    if (visitRequest.utilisateurId !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez annuler que vos propres demandes.",
      );
    }

    if (visitRequest.statut === VisitRequestStatus.TERMINEE) {
      throw new BadRequestException(
        "Impossible d'annuler une demande terminee.",
      );
    }

    return this.visitRequestsRepository.updateStatus(
      id,
      VisitRequestStatus.ANNULEE,
    );
  }

  private async getVisitRequestOrThrow(
    id: string,
  ): Promise<VisitRequestWithRelations> {
    const visitRequest = await this.visitRequestsRepository.findById(id);

    if (!visitRequest) {
      throw new NotFoundException('Demande de visite introuvable.');
    }

    return visitRequest;
  }

  private checkAgencyOwnership(
    visitRequest: VisitRequestWithRelations,
    agencyId: string,
  ): void {
    if (visitRequest.annonce.agencyId !== agencyId) {
      throw new ForbiddenException(
        "Vous ne pouvez gerer que les demandes de vos annonces.",
      );
    }
  }
}
