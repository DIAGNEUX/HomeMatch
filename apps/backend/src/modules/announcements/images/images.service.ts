import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ImagesRepository } from './repositories/images.repository';
  import { AnnouncementsService } from '../announcements.service';
  import { Image } from '@prisma/client';
  import { unlink } from 'fs/promises';
  import { join } from 'path';
  
  const MAX_IMAGES_PER_ANNONCE = 10;
  
  @Injectable()
  export class ImagesService {
    constructor(
      private readonly imagesRepository: ImagesRepository,
      private readonly announcementsService: AnnouncementsService,
    ) {}
  
    async uploadImage(
      annonceId: string,
      agencyId: string,
      filename: string,
    ): Promise<Image> {
      const annonce = await this.announcementsService.findOneAnnonce(annonceId);
  
      if (annonce.agencyId !== agencyId) {
        throw new ForbiddenException(
          "Vous n'êtes pas propriétaire de cette annonce.",
        );
      }
  
      const url = `/uploads/annonces/${filename}`;
  
      return this.imagesRepository.create(url, annonceId);
    }
  
    async deleteImage(
      imageId: string,
      agencyId: string,
    ): Promise<void> {
      const image = await this.imagesRepository.findById(imageId);
  
      if (!image) {
        throw new NotFoundException('Image introuvable.');
      }
  
      const annonce = await this.announcementsService.findOneAnnonce(
        image.annonceId,
      );
  
      if (annonce.agencyId !== agencyId) {
        throw new ForbiddenException(
          "Vous n'êtes pas propriétaire de cette annonce.",
        );
      }
  
      // Supprime le fichier physique du disque
      const filepath = join(process.cwd(), 'uploads', 'annonces', image.url.split('/').pop()!);
      try {
        await unlink(filepath);
      } catch {
        // Le fichier n'existe peut-être déjà plus, on continue quand même
      }
  
      await this.imagesRepository.delete(imageId);
    }
  }