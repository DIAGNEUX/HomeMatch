import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agencies')
export class AgenciesController {
  constructor(
    private readonly agenciesService: AgenciesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  create(
    @Request() req: any,
    @Body() createAgencyDto: CreateAgencyDto,
  ) {
    return this.agenciesService.create(
      req.user.id,
      createAgencyDto,
    );
  }


  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  getMyAgency(@Request() req: any) {
    return this.agenciesService.findByUserId(
      req.user.id,
    );
  }


  @Patch('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENCY)
  updateMyAgency(
    @Request() req: any,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(
      req.user.id,
      updateAgencyDto,
    );
  }
}