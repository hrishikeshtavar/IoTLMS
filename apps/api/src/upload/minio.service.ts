import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client | null = null;
  private readonly buckets = ['videos', 'pdfs', 'images', 'brand-assets'];

  async onModuleInit() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'simulearning_admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'simulearning_secret',
    });
    try {
      await this.initBuckets();
    } catch (error) {
      this.logger.warn(`MinIO unavailable at startup; upload endpoints will fail until MinIO is up. ${String(error)}`);
    }
  }

  private async initBuckets() {
    if (!this.client) return;
    const publicBuckets = ['images', 'brand-assets'];
    for (const bucket of this.buckets) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket);
        this.logger.log(`Created bucket: ${bucket}`);
      }
      // Make image/brand buckets publicly readable so URLs don't expire
      if (publicBuckets.includes(bucket)) {
        const policy = JSON.stringify({
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${bucket}/*`] }],
        });
        await this.client.setBucketPolicy(bucket, policy).catch(() => {});
      }
    }
  }

  getPublicUrl(bucket: string, key: string): string {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const publicUrl = process.env.MINIO_PUBLIC_URL;
    if (publicUrl) return `${publicUrl}/${bucket}/${key}`;
    const proto = useSSL ? 'https' : 'http';
    return `${proto}://${endpoint}:${port}/${bucket}/${key}`;
  }

  async uploadFile(bucket: string, key: string, buffer: Buffer, mimetype: string): Promise<string> {
    if (!this.client) throw new Error('MinIO client not initialized');
    await this.client.putObject(bucket, key, buffer, buffer.length, { 'Content-Type': mimetype });
    // Return permanent URL for public buckets (images), signed URL for private (videos, pdfs)
    const publicBuckets = ['images', 'brand-assets'];
    if (publicBuckets.includes(bucket)) {
      return this.getPublicUrl(bucket, key);
    }
    return this.client.presignedGetObject(bucket, key, 60 * 60 * 24 * 7); // 7 days for private
  }

  async getSignedUrl(bucket: string, key: string, expiry = 900): Promise<string> {
    if (!this.client) throw new Error('MinIO client not initialized');
    return this.client.presignedGetObject(bucket, key, expiry);
  }
}
