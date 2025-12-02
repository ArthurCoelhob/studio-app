import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceType } from '../service-type/service-type.entity';

export enum ProfileType {
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
}

@Entity()
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serviceTypeId: number;

  @Column({
    type: 'enum',
    enum: ProfileType,
  })
  profile: ProfileType;

  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'serviceTypeId' })
  serviceType: ServiceType;
}