import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Image } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { AnnouncementsService } from '../announcements.service';
import { CloudinaryService } from './cloudinary.service';
import { ImagesRepository } from './repositories/images.repository';
import type { UploadedImageFile } from './types/uploaded-image-file.type';

const MAX_IMAGES_PER_ANNONCE = 10;

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly announcementsService: AnnouncementsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(
    annonceId: string,
    agencyId: string,
    file: UploadedImageFile,
  ): Promise<Image> {
    const annonce = await this.announcementsService.findOneAnnonce(annonceId);

    if (annonce.agencyId !== agencyId) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette annonce.",
      );
    }

    const imagesCount = await this.imagesRepository.countByAnnonceId(annonceId);

    if (imagesCount >= MAX_IMAGES_PER_ANNONCE) {
      throw new BadRequestException(
        `Une annonce ne peut pas avoir plus de ${MAX_IMAGES_PER_ANNONCE} images.`,
      );
    }

    const uploadedImage =
      await this.cloudinaryService.uploadAnnouncementImage(file);

    try {
      return await this.imagesRepository.create({
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
        annonceId,
      });
    } catch (error) {
      await this.cloudinaryService.deleteImage(uploadedImage.publicId).catch(
        () => undefined,
      );
      throw error;
    }
  }

  async deleteImage(imageId: string, agencyId: string): Promise<void> {
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

    if (image.publicId) {
      await this.cloudinaryService.deleteImage(image.publicId);
    } else if (image.url.startsWith('/uploads/')) {
      await this.deleteLocalImage(image.url);
    }

    await this.imagesRepository.delete(imageId);
  }

  private async deleteLocalImage(url: string): Promise<void> {
    const filename = url.split('/').pop();

    if (!filename) {
      return;
    }

    const filepath = join(process.cwd(), 'uploads', 'annonces', filename);

    try {
      await unlink(filepath);
    } catch {
      // Le fichier local peut deja etre absent, on supprime quand meme la ligne en base.
    }
  }
}
