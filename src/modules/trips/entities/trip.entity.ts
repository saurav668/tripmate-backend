import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  destination: string;

  @Column({
    type: 'date',
  })
  startDate: string;

  @Column({
    type: 'date',
  })
  endDate: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  budget: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'PLANNING',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}