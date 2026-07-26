import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

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
}
