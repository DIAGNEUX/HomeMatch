import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminSearchAnnonceDto } from './dto/admin-search-annonce.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('register')
  register(@Body() registerDto: AdminRegisterDto) {
    return this.authService.register(registerDto, Role.ADMIN);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }

  // --- Users ---

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async findAllUsers() {
    const users = await this.adminService.findAllUsers();
    return { success: true, data: users };
  }

  @Patch('users/:id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async deactivateUser(@Param('id') id: string) {
    const user = await this.adminService.deactivateUser(id);
    return { success: true, data: user };
  }

  // --- Announcements ---

  @Get('announcements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async findAllAnnonces(@Query() filters: AdminSearchAnnonceDto) {
    const annonces = await this.adminService.findAllAnnonces(filters);
    return { success: true, data: annonces };
  }

  @Delete('announcements/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async deleteAnnonce(@Param('id') id: string) {
    await this.adminService.deleteAnnonce(id);
    return { success: true, message: 'Annonce supprimée avec succès.' };
  }

  // --- Agencies ---

  @Get('agencies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async findAllAgencies() {
    const agencies = await this.adminService.findAllAgencies();
    return { success: true, data: agencies };
  }

  @Get('agencies/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  async findAgencyById(@Param('id') id: string) {
    const agency = await this.adminService.findAgencyById(id);
    return { success: true, data: agency };
  }

  @Get('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
async getStats() {
  const stats = await this.adminService.getStats();
  return { success: true, data: stats };
}

}