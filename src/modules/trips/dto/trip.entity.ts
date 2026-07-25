import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import  { User }  from '../users/user.entity';
import { User} from 'src/modules/users/user.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => User) @JoinColumn({ name: 'creator_id' }) creator: User;
  @Column() title: string;
  @Column() destination: string;
  @Column({ name: 'start_date', type: 'date' }) startDate: string;
  @Column({ name: 'end_date', type: 'date' }) endDate: string;
  @Column({ name: 'max_members', default: 10 }) maxMembers: number;
  @Column({ name: 'budget_per_person', type: 'decimal', precision: 10, scale: 2, nullable: true }) budgetPerPerson: number;
  @Column({ nullable: true, type: 'text' }) description: string;
  @Column({ name: 'cover_image', nullable: true }) coverImage: string;
  @Column({ default: 'open' }) status: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}