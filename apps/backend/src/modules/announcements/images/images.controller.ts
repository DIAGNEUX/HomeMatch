import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AgenciesService } from '../../agencies/agencies.service';
import { ImagesService } from './images.service';
import type { UploadedImageFile } from './types/uploaded-image-file.type';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

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
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Format non autorise : jpeg, png, webp ou avif uniquement.',
            ),
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
    @UploadedFile() file: UploadedImageFile,
    @Req() req,
  ) {
    const agency = await this.agenciesService.findByUserId(req.user.id);
    const image = await this.imagesService.uploadImage(
      annonceId,
      agency.id,
      file,
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
      message: 'Image supprimee avec succes.',
    };
  }
}
