import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripsRepository: Repository<Trip>,
  ) {}

  async createTrip(
    userId: string,
    dto: CreateTripDto,
  ) {
    const trip =
      this.tripsRepository.create({
        createdBy: userId,
        destination: dto.destination,
        startDate: dto.startDate,
        endDate: dto.endDate,
        budget: dto.budget,
        description: dto.description ?? null,
      });

    return this.tripsRepository.save(trip);
  }
  async getMyTrips(userId: string) {
  return this.tripsRepository.find({
    where: {
      createdBy: userId,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

   async getTripById(tripId: string) {
    const trip = await this.tripsRepository.findOne({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      throw new NotFoundException(
        'Trip not found',
      );
    }

    return trip;
  }
}