import {
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TripPartnerService } from './trip-partner.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips')
export class TripPartnerController {
  constructor(
    private readonly requestsService: TripPartnerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':tripId/requests')
  async sendRequest(
    @Param('tripId') tripId: string,
    @Req() req: any,
  ) {
    return this.requestsService.sendRequest(
      tripId,
      req.user.userId,
    );
  }
}