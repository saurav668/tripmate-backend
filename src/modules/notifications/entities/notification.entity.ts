import { NotificationType } from 'src/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User who receives the notification
   */
  @Column({ type: 'uuid' })
  userId: string;

  /**
   * Type of notification
   */
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * Notification message
   */
  @Column({ type: 'text' })
  message: string;

  /**
   * ID of the related resource.
   *
   * Example:
   * TRIP_REQUEST      -> TripPartnerRequest.id
   * REQUEST_ACCEPTED  -> TripPartnerRequest.id
   * TRIP_UPDATED      -> Trip.id
   * NEW_MESSAGE       -> Message.id
   */
  @Column({ type: 'uuid', nullable: true })
  referenceId: string | null;

  /**
   * Optional resource type.
   *
   * Example:
   * TRIP
   * TRIP_PARTNER_REQUEST
   * MESSAGE
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  referenceType: string | null;

  /**
   * Whether user has seen/read the notification
   */
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}