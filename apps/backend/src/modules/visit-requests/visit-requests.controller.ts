import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AgenciesService } from '../agencies/agencies.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateVisitRequestDto } from './dto/create-visit-request.dto';
import { UpdateVisitRequestStatusDto } from './dto/update-visit-request-status.dto';
import { VisitRequestsService } from './visit-requests.service';

@ApiTags('Visit requests')
@Controller('visit-requests')
export class VisitRequestsController {
  constructor(
    private readonly visitRequestsService: VisitRequestsService,
    private readonly agenciesService: AgenciesService,
  ) {}

  @Post('announcements/:announcementId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  @ApiParam({ name: 'announcementId', example: 'clx123announcementid' })
  async create(
    @Param('announcementId') announcementId: string,
    @Body() dto: CreateVisitRequestDto,
    @Req() req: any,
  ) {
    const visitRequest = await this.visitRequestsService.create(
      announcementId,
      req.user.id,
      dto,
    );

    return {
      success: true,
      data: visitRequest,
    };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  async findMine(@Req() req: any) {
    const visitRequests = await this.visitRequestsService.findByUser(
      req.user.id,
    );

    return {
      success: true,
      data: visitRequests,
    };
  }

  @Get('received')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  async findReceived(@Req() req: any) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const visitRequests = await this.visitRequestsService.findByAgency(
      agency.id,
    );

    return {
      success: true,
      data: visitRequests,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.AGENCY)
  @ApiParam({ name: 'id', example: 'clx123visitrequestid' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVisitRequestStatusDto,
    @Req() req: any,
  ) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const visitRequest = await this.visitRequestsService.updateStatus(
      id,
      agency.id,
      dto,
    );

    return {
      success: true,
      data: visitRequest,
    };
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.USER)
  @ApiParam({ name: 'id', example: 'clx123visitrequestid' })
  async cancel(@Param('id') id: string, @Req() req: any) {
    const visitRequest = await this.visitRequestsService.cancel(
      id,
      req.user.id,
    );

    return {
      success: true,
      data: visitRequest,
    };
  }
}
