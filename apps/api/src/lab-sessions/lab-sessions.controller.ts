import { Controller, Post, Patch, Get, Body, Param, Req, ForbiddenException } from '@nestjs/common';
import { LabSessionsService } from './lab-sessions.service';

@Controller('lab-sessions')
export class LabSessionsController {
  constructor(private svc: LabSessionsService) {}

  @Post('start')
  start(@Body() body: { user_id?: string; lesson_id: string }, @Req() req: any) {
    // Identity comes from the token; only admins may start a session for another user.
    const caller = req.user;
    const isAdmin = caller?.role === 'admin' || caller?.role === 'super_admin';
    const userId = (isAdmin && body.user_id) ? body.user_id : caller?.id;
    if (!userId) throw new ForbiddenException('No authenticated user');
    return this.svc.startSession(userId, body.lesson_id);
  }

  @Patch(':id/end')
  end(@Param('id') id: string, @Body() body: { status: 'completed' | 'abandoned' }) {
    return this.svc.endSession(id, body.status);
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string, @Req() req: any) {
    const caller = req.user;
    const isAdmin = caller?.role === 'admin' || caller?.role === 'super_admin';
    if (!isAdmin && caller?.id !== userId) throw new ForbiddenException('Not permitted');
    return this.svc.getSessionsByUser(userId);
  }
}
