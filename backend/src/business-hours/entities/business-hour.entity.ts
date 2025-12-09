import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('business_hours')
export class BusinessHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda..... 6 = Sábado xD

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: true })
  isActive: boolean;
}
