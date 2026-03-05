import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private readonly minioService: MinioService) {}

  async upload(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const key = `${randomUUID()}.${ext}`;
    const bucket = this.getBucket(file.mimetype);

    await this.minioService.upload(bucket, key, file.buffer);
    const url = await this.minioService.getSignedUrl(bucket, key);

    return { url, key, bucket };
  }

  private getBucket(mimetype: string) {
    if (mimetype.startsWith('video')) return 'videos';
    if (mimetype === 'application/pdf') return 'pdfs';
    if (mimetype.startsWith('image')) return 'images';
    return 'images';
  }
}
