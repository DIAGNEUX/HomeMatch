import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AdminSearchAnnonceDto } from './dto/admin-search-annonce.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Users ---

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deactivateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Announcements ---

  async findAllAnnonces(filters: AdminSearchAnnonceDto) {
    return this.prisma.annonce.findMany({
      where: {
        agencyId: filters.agencyId,
        statut: filters.statut,
      },
      include: { agency: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteAnnonce(id: string) {
    const annonce = await this.prisma.annonce.findUnique({ where: { id } });

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable.');
    }

    return this.prisma.annonce.delete({ where: { id } });
  }

  // --- Agencies ---

  async findAllAgencies() {
    return this.prisma.agency.findMany({
      include: {
        _count: { select: { annonces: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAgencyById(id: string) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
      include: { annonces: { include: { images: true } } },
    });

    if (!agency) {
      throw new NotFoundException('Agence introuvable.');
    }

    return agency;
  }

  async getStats() {
  const [totalUsers, totalAgencies, totalAnnonces, publishedCount, draftCount, inactiveUsers, recentAgencies] =
    await Promise.all([
      this.prisma.user.count(),
      this.prisma.agency.count(),
      this.prisma.annonce.count(),
      this.prisma.annonce.count({ where: { statut: 'PUBLIEE' } }),
      this.prisma.annonce.count({ where: { statut: 'BROUILLON' } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.agency.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { annonces: true } } },
      }),
    ]);

  return {
    totalUsers,
    totalAgencies,
    totalAnnonces,
    publishedCount,
    draftCount,
    inactiveUsers,
    recentAgencies,
  };
}

}