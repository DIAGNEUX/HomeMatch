import { Injectable } from '@nestjs/common';
import {
  Prisma,
  StatutDemandeVisite as VisitRequestStatus,
} from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

const visitRequestInclude = {
  annonce: {
    include: {
      images: true,
      agency: true,
    },
  },
  utilisateur: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
    },
  },
} satisfies Prisma.DemandeVisiteInclude;

export type VisitRequestWithRelations = Prisma.DemandeVisiteGetPayload<{
  include: typeof visitRequestInclude;
}>;

interface CreateVisitRequestData {
  announcementId: string;
  userId: string;
  requestedVisitDate: Date;
  message: string;
}

@Injectable()
export class VisitRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateVisitRequestData): Promise<VisitRequestWithRelations> {
    return this.prisma.demandeVisite.create({
      data: {
        annonceId: data.announcementId,
        utilisateurId: data.userId,
        dateVisiteSouhaitee: data.requestedVisitDate,
        message: data.message,
      },
      include: visitRequestInclude,
    });
  }

  findById(id: string): Promise<VisitRequestWithRelations | null> {
    return this.prisma.demandeVisite.findUnique({
      where: { id },
      include: visitRequestInclude,
    });
  }

  findActiveByAnnouncementAndUser(
    announcementId: string,
    userId: string,
  ): Promise<VisitRequestWithRelations | null> {
    return this.prisma.demandeVisite.findFirst({
      where: {
        annonceId: announcementId,
        utilisateurId: userId,
        statut: {
          in: [
            VisitRequestStatus.EN_ATTENTE,
            VisitRequestStatus.ACCEPTEE,
          ],
        },
      },
      include: visitRequestInclude,
    });
  }

  findByUser(userId: string): Promise<VisitRequestWithRelations[]> {
    return this.prisma.demandeVisite.findMany({
      where: { utilisateurId: userId },
      orderBy: { dateDemande: 'desc' },
      include: visitRequestInclude,
    });
  }

  findByAgency(agencyId: string): Promise<VisitRequestWithRelations[]> {
    return this.prisma.demandeVisite.findMany({
      where: {
        annonce: {
          agencyId,
        },
      },
      orderBy: { dateDemande: 'desc' },
      include: visitRequestInclude,
    });
  }

  updateStatus(
    id: string,
    status: VisitRequestStatus,
  ): Promise<VisitRequestWithRelations> {
    return this.prisma.demandeVisite.update({
      where: { id },
      data: { statut: status },
      include: visitRequestInclude,
    });
  }
}
