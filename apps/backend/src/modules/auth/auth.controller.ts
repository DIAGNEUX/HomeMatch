import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  clearAuthCookie,
  setAuthCookie,
} from './utils/auth-cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, Role.USER);
  }

  @Post('register/agency')
  async registerAgency(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.register(
      registerDto,
      Role.AGENCY,
    );

    setAuthCookie(response, authResponse.access_token);

    return authResponse;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResponse = await this.authService.login(loginDto);

    setAuthCookie(response, authResponse.access_token);

    return authResponse;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    clearAuthCookie(response);

    return {
      success: true,
      message: 'Déconnexion réussie.',
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
