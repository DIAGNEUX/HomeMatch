import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Agency } from '@prisma/client';
import { CreateAgencyDto } from '../dto/create-agency.dto';

@Injectable()
export class AgencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createAgencyDto: CreateAgencyDto,
  ): Promise<Agency> {
    return this.prisma.agency.create({
      data: {
        ...createAgencyDto,
        userId,
      },
    });
  }

  async findByUserId(userId: string): Promise<Agency | null> {
    return this.prisma.agency.findUnique({
      where: {
        userId,
      },
    });
  }

  async findById(id: string): Promise<Agency | null> {
    return this.prisma.agency.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: Partial<CreateAgencyDto>,
  ): Promise<Agency> {
    return this.prisma.agency.update({
      where: {
        id,
      },
      data,
    });
  }

  async findBySiret(siret: string): Promise<Agency | null> {
    return this.prisma.agency.findUnique({
        where: {
        siret,
        },
    });
    }
}