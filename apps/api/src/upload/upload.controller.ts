import { Response } from 'express';
import { Res, Param, Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Req } from '@nestjs/common';
import { Response } from 'express';
import { Res, Param, FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Res, Param, UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
      stream.pipe(res as any);
    } catch {
      res.status(404).json({ message: 'Asset not found' });
    }
  }
}
