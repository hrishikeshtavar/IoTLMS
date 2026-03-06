import { Controller, Post, Patch, Get, Body, Param } from '@nestjs/common';
import { LabSessionsService } from './lab-sessions.service';

@Controller('lab-sessions')
export class LabSessionsController {
  constructor(private svc: LabSessionsService) {}

  @Post('start')
  start(@Body() body: { user_id: string; lesson_id: string }) {
    return this.svc.startSession(body.user_id, body.lesson_id);
  }

  @Patch(':id/end')
  end(@Param('id') id: string, @Body() body: { status: 'completed' | 'abandoned' }) {
    return this.svc.endSession(id, body.status);
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.svc.getSessionsByUser(userId);
  }
}
