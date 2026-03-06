import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class SubtitlesService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? 'placeholder',
    });
  }

  async generateFromAudioFile(audioPath: string, language = 'en'): Promise<string> {
    const audioStream = fs.createReadStream(audioPath);
    const transcription = await this.openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      response_format: 'vtt',
      language,
    });
    return transcription as unknown as string;
  }

  vttFromText(text: string): string {
    // Generate basic VTT from plain text (fallback)
    const words = text.split(' ');
    const chunks: string[] = [];
    const chunkSize = 8;
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    let vtt = 'WEBVTT\n\n';
    chunks.forEach((chunk, i) => {
      const start = i * 4;
      const end = start + 4;
      vtt += `${formatTime(start)} --> ${formatTime(end)}\n${chunk}\n\n`;
    });
    return vtt;
  }
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}.000`;
}
