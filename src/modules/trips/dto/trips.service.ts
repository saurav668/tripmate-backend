import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
  ) {}

  findAll() {
    return this.tripRepo.find({ relations: ['creator'] });
  }

  async findOne(id: number) {
    const trip = await this.tripRepo.findOne({ where: { id }, relations: ['creator'] });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  create(data: Partial<Trip>) {
    const trip = this.tripRepo.create(data);
    return this.tripRepo.save(trip);
  }

  async update(id: number, data: Partial<Trip>) {
    await this.tripRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.tripRepo.delete(id);
  }

  findByDestination(destination: string) {
    return this.tripRepo.find({ where: { destination, status: 'open' }, relations: ['creator'] });
  }
}