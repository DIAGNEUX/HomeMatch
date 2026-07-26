import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { SearchAnnonceDto } from './dto/search-annonce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AgenciesService } from '../agencies/agencies.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly agenciesService: AgenciesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async create(@Body() dto: CreateAnnonceDto, @Req() req) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const annonce = await this.announcementsService.createAnnonce(dto, agency.id);

    return {
      success: true,
      data: annonce,
    };
  }

  @Get()
  async findAll(@Query() searchDto: SearchAnnonceDto) {
    const result = await this.announcementsService.searchPublicAnnonces(
      searchDto,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async findMine(@Req() req) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const annonces = await this.announcementsService.findByAgency(agency.id);

    return {
      success: true,
      data: annonces,
    };
  }

  @Get(':id')
async findOne(@Param('id') id: string) {
  const annonce = await this.announcementsService.findPublicAnnonce(id);
  return {
    success: true,
    data: annonce,
  };
}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnnonceDto,
    @Req() req,
  ) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const annonce = await this.announcementsService.updateAnnonce(
      id,
      dto,
      agency.id,
    );

    return {
      success: true,
      data: annonce,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async remove(@Param('id') id: string, @Req() req) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    await this.announcementsService.deleteAnnonce(id, agency.id);

    return {
      success: true,
      message: 'Annonce supprimée avec succès.',
    };
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async publish(@Param('id') id: string, @Req() req) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const annonce = await this.announcementsService.publishAnnonce(
      id,
      agency.id,
    );

    return {
      success: true,
      data: annonce,
    };
  }
}