import { TripPartnerStatus } from 'src/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('trip_partner')
export class TripPartner{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  tripId: string;

  @Column({
    type: 'uuid',
  })
  senderId: string;

  @Column({
    type: 'uuid',
  })
  receiverId: string;

  @Column({
      type: 'enum',
      enum: TripPartnerStatus,
      default: TripPartnerStatus.PENDING,
  })
  status: TripPartnerStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}