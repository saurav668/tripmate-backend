import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(user: Partial<User>) {
    return this.usersRepository.create(user);
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  findById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.hashedRefreshToken')
      .where('user.email = :email', { email })
      .getOne();
  }

  async updateRefreshToken(
    userId: number,
    hashedRefreshToken: any,
  ) {
    await this.usersRepository.update(userId, {
      hashedRefreshToken,
    });
  }

  async delete(userId: string) {
    return this.usersRepository.delete(userId);
  }
}