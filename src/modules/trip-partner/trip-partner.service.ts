import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  TripPartner,
} from './entities/trip-partner.entity';

import { TripsService } from '../trips/trips.service';
import { TripPartnerStatus } from 'src/constant';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TripPartnerService {
  constructor(
    @InjectRepository(TripPartner)
    private readonly requestsRepository: Repository<TripPartner>,
    private readonly notificationsService: NotificationsService,
    private readonly tripsService: TripsService,
  ) {}

 async sendRequest(
  tripId: string,
  senderId: string,
) {
  const trip =
    await this.tripsService.getTripById(
      tripId,
    );

  // Prevent requesting your own trip
  if (trip.createdBy === senderId) {
    throw new BadRequestException(
      'You cannot send a request to your own trip',
    );
  }

  // Check existing pending request
  const existingRequest =
    await this.requestsRepository.findOne({
      where: {
        tripId,
        senderId,
        status: TripRequestStatus.PENDING,
      },
    });

  if (existingRequest) {
    throw new ConflictException(
      'You already have a pending request for this trip',
    );
  }

  // Create request
  const request =
    this.requestsRepository.create({
      tripId,
      senderId,
      receiverId: trip.createdBy,
      status: TripRequestStatus.PENDING,
    });

  // Save request
  const savedRequest =
    await this.requestsRepository.save(
      request,
    );

  // Create notification for trip owner
  await this.notificationsService.createNotification({
    userId: trip.createdBy,
    type: NotificationType.TRIP_REQUEST,
    title: 'New Trip Partner Request',
    message:
      'Saurav has requested to join your trip.',
    tripId: trip.id,
    requestId: savedRequest.id,
  });

  return savedRequest;
}
}