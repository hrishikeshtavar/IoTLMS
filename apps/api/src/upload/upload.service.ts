import { Injectable, BadRequestException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const LIMITS: Record<string, number> = {
  videos: 500 * 1024 * 1024,
  pdfs: 50 * 1024 * 1024,
  images: 5 * 1024 * 1024,
};

const MIME_TO_BUCKET: Record<string, string> = {
  'video/mp4': 'videos',
  'video/webm': 'videos',
  'application/pdf': 'pdfs',
  'image/jpeg': 'images',
  'image/png': 'images',
  'image/webp': 'images',
};

@Injectable()
export class UploadService {
  constructor(private readonly minio: MinioService) {}

  async uploadFile(file: Express.Multer.File, tenantId: string) {
    const bucket = MIME_TO_BUCKET[file.mimetype];
    if (!bucket) throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);

    const limit = LIMITS[bucket];
    if (file.size > limit) throw new BadRequestException(`File exceeds ${limit / 1024 / 1024}MB limit`);

    const ext = path.extname(file.originalname);
    const key = `${tenantId}/${uuidv4()}${ext}`;
    const url = await this.minio.uploadFile(bucket, key, file.buffer, file.mimetype);
    return { url, key, bucket };
  }
}
