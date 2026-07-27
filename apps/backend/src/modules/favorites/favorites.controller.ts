import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles(Role.USER)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('announcements/:announcementId')
  async add(@Req() req: any, @Param('announcementId') announcementId: string) {
    const favorite = await this.favoritesService.add(
      req.user.id,
      announcementId,
    );

    return {
      success: true,
      data: favorite,
    };
  }

  @Delete('announcements/:announcementId')
  async remove(
    @Req() req: any,
    @Param('announcementId') announcementId: string,
  ) {
    await this.favoritesService.remove(req.user.id, announcementId);

    return {
      success: true,
      message: 'Annonce retirée des favoris.',
    };
  }

  @Get('mine')
  async findMine(@Req() req: any) {
    const favorites = await this.favoritesService.findMine(req.user.id);

    return {
      success: true,
      data: favorites,
    };
  }

  @Get('announcements/:announcementId/status')
  async getStatus(
    @Req() req: any,
    @Param('announcementId') announcementId: string,
  ) {
    const status = await this.favoritesService.getStatus(
      req.user.id,
      announcementId,
    );

    return {
      success: true,
      data: status,
    };
  }
}
