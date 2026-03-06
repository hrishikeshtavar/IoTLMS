import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { SubtitlesService } from './subtitles.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('subtitles')
export class SubtitlesController {
  constructor(private svc: SubtitlesService) {}

  @Post('generate-from-text')
  generateFromText(@Body() body: { text: string; locale?: string }) {
    const vtt = this.svc.vttFromText(body.text);
    return { vtt, locale: body.locale ?? 'en' };
  }

  @Post('generate-from-audio')
  async generateFromAudio(@Body() body: { audioPath: string; language?: string }) {
    const vtt = await this.svc.generateFromAudioFile(body.audioPath, body.language ?? 'en');
    return { vtt };
  }
}
