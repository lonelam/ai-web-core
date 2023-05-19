import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum WorkerType {
  MANUAL = 'manual',
  PASSIVE = 'passive',
  ACTIVE = 'active',
}

export enum WorkerStatus {
  INVALID = 'invalid',
  OFFLINE = 'offline',
  ONLINE = 'online',
}

@Entity()
export class TaskWorker {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  ip: string;

  @Column({
    default: true,
  })
  enabled: boolean;

  @CreateDateColumn()
  createTime: Date;

  @Column({
    type: 'enum',
    enum: WorkerStatus,
    default: WorkerStatus.OFFLINE,
  })
  workerStatus: WorkerStatus;
}
