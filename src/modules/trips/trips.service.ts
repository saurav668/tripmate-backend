import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripsRepository: Repository<Trip>,
  ) { }

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


  async updateTrip(
    tripId: string,
    userId: string,
    dto: UpdateTripDto,
  ) {
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

    if (trip.createdBy !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this trip',
      );
    }

    Object.assign(trip, dto);

    return this.tripsRepository.save(trip);
  }


  async deleteTrip(
  tripId: string,
  userId: string,
) {
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

  if (trip.createdBy !== userId) {
    throw new ForbiddenException(
      'You are not allowed to delete this trip',
    );
  }

  await this.tripsRepository.delete(tripId);

  return {
    message: 'Trip deleted successfully',
  };
}

async searchTrips(
  userId: string,
  destination: string,
) {
  if (!destination?.trim()) {
    throw new BadRequestException(
      'Destination is required',
    );
  }

  return this.tripsRepository
    .createQueryBuilder('trip')
    .where('LOWER(trip.destination) LIKE LOWER(:destination)', {
      destination: `%${destination}%`,
    })
    .andWhere('trip.createdBy != :userId', {
      userId,
    })
    .orderBy('trip.createdAt', 'DESC')
    .getMany();
}
}