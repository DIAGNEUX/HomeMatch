import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
import type { UploadedImageFile } from './types/uploaded-image-file.type';

type UploadedCloudinaryImage = {
  url: string;
  publicId: string;
};

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  private ensureConfigured(): void {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Configuration Cloudinary manquante.',
      );
    }
  }

  uploadAnnouncementImage(
    file: UploadedImageFile,
  ): Promise<UploadedCloudinaryImage> {
    if (!file?.buffer) {
      throw new BadRequestException('Fichier image manquant.');
    }

    this.ensureConfigured();

    return new Promise((resolve, reject) => {
      const rejectUpload = () => {
        reject(
          new InternalServerErrorException(
            "L'upload de l'image a echoue.",
          ),
        );
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'homematch/announcements',
          resource_type: 'image',
        },
        (
          error?: UploadApiErrorResponse,
          result?: UploadApiResponse,
        ) => {
          if (error || !result) {
            rejectUpload();
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      const bufferStream = Readable.from(file.buffer);

      bufferStream.on('error', rejectUpload);
      uploadStream.on('error', rejectUpload);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    this.ensureConfigured();

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    } catch {
      throw new InternalServerErrorException(
        "La suppression de l'image Cloudinary a échoué.",
      );
    }
  }
}
