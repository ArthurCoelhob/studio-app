import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceType } from '../service-type/service-type.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ default: 0 })
  attendance: number;

  @Column()
  serviceTypeId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'client' })
  role: string;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.clients)
  @JoinColumn({ name: 'serviceTypeId' })
  serviceType: ServiceType;
}