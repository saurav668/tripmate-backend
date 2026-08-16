import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrip(
    @Req() req: any,
    @Body() dto: CreateTripDto,
  ) {
    return this.tripsService.createTrip(
      req.user.userId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-trips')
  async getMyTrips(@Req() req: any) {
    return this.tripsService.getMyTrips(
      req.user.userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTripsWithID(@Param('id') tripId: string,){
    return this.tripsService.getTripById(
       tripId
    )
  }
}