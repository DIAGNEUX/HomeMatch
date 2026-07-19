import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Agency } from '@prisma/client';
import { AgencyRepository } from './repositories/agencies.repository';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    private readonly agencyRepository: AgencyRepository,
  ) {}

    private async getAgencyByUserId(
    userId: string,
  ): Promise<Agency | null> {
    return this.agencyRepository.findByUserId(userId);
  }

    async create(
    userId: string,
    createAgencyDto: CreateAgencyDto,
    ): Promise<Agency> {

    const existingAgency =
    await this.getAgencyByUserId(userId);

    if (existingAgency) {
        throw new ConflictException(
        'Vous avez déjà créé votre agence.',
        );
    }

    const existingSiret =
        await this.findBySiret(createAgencyDto.siret);

    if (existingSiret) {
        throw new ConflictException(
        'Une agence avec ce SIRET existe déjà.',
        );
    }

    return this.agencyRepository.create(
        userId,
        createAgencyDto,
    );
    }
  async findByUserId(
    userId: string,
  ): Promise<Agency> {
    const agency =
      await this.agencyRepository.findByUserId(userId);

    if (!agency) {
      throw new NotFoundException(
        "Aucun profil d'agence trouvé.",
      );
    }

    return agency;
  }

  async findById(
    id: string,
  ): Promise<Agency | null> {
    return this.agencyRepository.findById(id);
  }

  async update(
    userId: string,
    updateAgencyDto: UpdateAgencyDto,
  ): Promise<Agency> {
    const agency = await this.findByUserId(userId);

    return this.agencyRepository.update(
      agency.id,
      updateAgencyDto,
    );
  }

  async findBySiret(siret: string): Promise<Agency | null> {
    return this.agencyRepository.findBySiret(siret);
  }


}