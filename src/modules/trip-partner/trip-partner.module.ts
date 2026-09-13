import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TripPartner } from './entities/trip-partner.entity';
import { TripPartnerController } from './trip-partner.controller';
import { TripPartnerService } from './trip-partner.service';

import { TripsModule } from '../trips/trips.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TripPartner,
    ]),

    TripsModule,
    NotificationsModule,
  ],

  controllers: [
    TripPartnerController,
  ],

  providers: [
    TripPartnerService,
  ],
})
export class TripPartnerModule {}