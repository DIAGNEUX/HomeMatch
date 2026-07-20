import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AgenciesService } from '../agencies/agencies.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly agenciesService: AgenciesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENCY)
  async create(@Body() dto: CreateAnnonceDto, @Req() req) {
    const agency = await this.agenciesService.findByUserId(req.user.id);

    const annonce = await this.announcementsService.createAnnonce(dto, agency.id);

    return {
      success: true,
      data: annonce,
    };
  }
}