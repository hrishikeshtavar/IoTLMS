import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Minio.Client;

  async onModuleInit() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'iotlearn_admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'iotlearn_secret',
    });

    const buckets = ['videos', 'pdfs', 'images', 'brand-assets'];

    for (const bucket of buckets) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket);
      }
    }
  }

  async upload(bucket: string, key: string, buffer: Buffer) {
    return this.client.putObject(bucket, key, buffer);
  }

  async getSignedUrl(bucket: string, key: string) {
    return this.client.presignedGetObject(bucket, key, 60 * 60 * 24);
  }
}
