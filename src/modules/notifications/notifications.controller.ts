import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  async getNotifications(@Req() req: any) {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
    );
  }

  @Get('unread')
  async getUnreadNotifications(@Req() req: any) {
    return this.notificationsService.getUnreadNotifications(
      req.user.userId,
    );
  }

  @Get('unread/count')
  async getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(
      req.user.userId,
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @Req() req: any,
  ) {
    return this.notificationsService.markAsRead(
      notificationId,
      req.user.userId,
    );
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(
      req.user.userId,
    );
  }
}