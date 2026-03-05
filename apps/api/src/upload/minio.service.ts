import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private readonly buckets = ['videos', 'pdfs', 'images', 'brand-assets'];

  onModuleInit() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'iotlearn_admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'iotlearn_secret',
    });
    this.initBuckets();
  }

  private async initBuckets() {
    for (const bucket of this.buckets) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket);
        this.logger.log(`Created bucket: ${bucket}`);
      }
    }
  }

  async uploadFile(bucket: string, key: string, buffer: Buffer, mimetype: string): Promise<string> {
    await this.client.putObject(bucket, key, buffer, buffer.length, { 'Content-Type': mimetype });
    return this.client.presignedGetObject(bucket, key, 60 * 60 * 24);
  }

  async getSignedUrl(bucket: string, key: string, expiry = 900): Promise<string> {
    return this.client.presignedGetObject(bucket, key, expiry);
  }
}
