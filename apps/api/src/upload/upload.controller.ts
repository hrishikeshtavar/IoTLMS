import { Controller, Get, Post, Param, Res, UseInterceptors, UploadedFile, BadRequestException, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { MinioService } from './minio.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly minioService: MinioService,
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('No file provided');
    const tenantId = req.tenantId ?? 'default';
    return this.uploadService.uploadFile(file, tenantId);
  }

  @Public()
  @Get('assets/:bucket/:key')
  async serveAsset(@Param('bucket') bucket: string, @Param('key') key: string, @Res() res: Response) {
    try {
      const stream = await this.minioService.getObjectStream(bucket, key);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      (stream as any).pipe(res);
    } catch {
      res.status(404).json({ message: 'Asset not found' });
    }
  }
}
