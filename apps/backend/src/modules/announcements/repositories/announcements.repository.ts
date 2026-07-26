import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateAnnonceDto } from '../dto/create-annonce.dto';
import { UpdateAnnonceDto } from '../dto/update-annonce.dto';
import { SearchAnnonceDto } from '../dto/search-annonce.dto';
import { Annonce, Prisma, StatutAnnonce } from '@prisma/client';

export interface AnnonceSearchFilters {
  ville?: string;
  typeAnnonce?: 'VENTE' | 'LOCATION';
  typeBien?: string;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  nombrePiecesMin?: number;
  nombreChambresMin?: number;
}

@Injectable()
export class AnnouncementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAnnonceDto, agencyId: string): Promise<Annonce> {
    return this.prisma.annonce.create({
      data: {
        ...data,
        agencyId,
      },
    });
  }

  findById(id: string): Promise<Annonce | null> {
    return this.prisma.annonce.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  update(id: string, data: UpdateAnnonceDto): Promise<Annonce> {
    return this.prisma.annonce.update({
      where: { id },
      data,
    });
  }

  delete(id: string): Promise<Annonce> {
    return this.prisma.annonce.delete({
      where: { id },
    });
  }

  updateStatut(id: string, statut: StatutAnnonce): Promise<Annonce> {
    return this.prisma.annonce.update({
      where: { id },
      data: { statut },
    });
  }

  findAll(): Promise<Annonce[]> {
    return this.prisma.annonce.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
  }

  findByAgency(agencyId: string): Promise<Annonce[]> {
    return this.prisma.annonce.findMany({
      where: { agencyId },
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
  }

  async searchPublic(
    filters: SearchAnnonceDto,
  ): Promise<{ data: Annonce[]; total: number }> {
    const where: Prisma.AnnonceWhereInput = {
      statut: StatutAnnonce.PUBLIEE,
    };

    if (filters.q) {
      where.OR = [
        { titre: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { ville: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    if (filters.ville) {
      where.ville = { contains: filters.ville, mode: 'insensitive' };
    }
    if (filters.typeAnnonce) where.typeAnnonce = filters.typeAnnonce;
    if (filters.typeBien) where.typeBien = filters.typeBien as any;

    if (filters.prixMin || filters.prixMax) {
      where.prix = {};
      if (filters.prixMin) where.prix.gte = filters.prixMin;
      if (filters.prixMax) where.prix.lte = filters.prixMax;
    }
    if (filters.surfaceMin) where.surface = { gte: filters.surfaceMin };
    if (filters.nombrePiecesMin)
      where.nombrePieces = { gte: filters.nombrePiecesMin };
    if (filters.nombreChambresMin)
      where.nombreChambres = { gte: filters.nombreChambresMin };

    const sortBy = filters.sortBy ?? 'createdAt';
    const order = filters.order ?? 'desc';
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;

    const [data, total] = await Promise.all([
      this.prisma.annonce.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { images: true },
      }),
      this.prisma.annonce.count({ where }),
    ]);

    return { data, total };
  }

  search(filters: AnnonceSearchFilters): Promise<Annonce[]> {
    const where: Prisma.AnnonceWhereInput = {
      statut: StatutAnnonce.PUBLIEE,
    };

    if (filters.ville) {
      where.ville = { contains: filters.ville, mode: 'insensitive' };
    }
    if (filters.typeAnnonce) where.typeAnnonce = filters.typeAnnonce;
    if (filters.typeBien) where.typeBien = filters.typeBien as any;
    if (filters.prixMin || filters.prixMax) {
      where.prix = {};
      if (filters.prixMin) where.prix.gte = filters.prixMin;
      if (filters.prixMax) where.prix.lte = filters.prixMax;
    }
    if (filters.surfaceMin) where.surface = { gte: filters.surfaceMin };
    if (filters.nombrePiecesMin)
      where.nombrePieces = { gte: filters.nombrePiecesMin };
    if (filters.nombreChambresMin)
      where.nombreChambres = { gte: filters.nombreChambresMin };

    return this.prisma.annonce.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { images: true },
    });
  }
}