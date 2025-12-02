import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class ServiceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  sessionCount: number;

  @OneToMany(() => Client, (client) => client.serviceType)
  clients: Client[];
}