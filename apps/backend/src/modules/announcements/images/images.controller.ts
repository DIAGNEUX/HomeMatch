import {
    Controller,
    Post,
    Delete,
    Param,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
    HttpStatus,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { ImagesService } from './images.service';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../../auth/guards/roles.guard';
  import { Roles } from '../../auth/decorators/roles.decorator';
  import { Role } from '@prisma/client';
  import { AgenciesService } from '../../agencies/agencies.service';
  import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
  
  @Controller('announcements/:annonceId/images')
  export class ImagesController {
    constructor(
      private readonly imagesService: ImagesService,
      private readonly agenciesService: AgenciesService,
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @Roles(Role.AGENCY)
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/annonces',
          filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(
              new Error('Format de fichier non autorisé (jpeg, png, webp uniquement).'),
              false,
            );
          }
          callback(null, true);
        },
        limits: { fileSize: MAX_FILE_SIZE },
      }),
    )
    async upload(
      @Param('annonceId') annonceId: string,
      @UploadedFile() file: Express.Multer.File,
      @Req() req,
    ) {
      const agency = await this.agenciesService.findByUserId(req.user.id);
      const image = await this.imagesService.uploadImage(
        annonceId,
        agency.id,
        file.filename,
      );
  
      return {
        success: true,
        data: image,
      };
    }
  
    @Delete(':imageId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.AGENCY)
    async remove(@Param('imageId') imageId: string, @Req() req) {
      const agency = await this.agenciesService.findByUserId(req.user.id);
      await this.imagesService.deleteImage(imageId, agency.id);
  
      return {
        success: true,
        message: 'Image supprimée avec succès.',
      };
    }
  }