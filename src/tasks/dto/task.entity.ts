import { User } from 'src/user/dto/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskTemplate } from './taskTemplate.entity';
import { TaskWorker } from './taskWorker.entity';
export enum TaskStatus {
  INIT = 'init',
  QUEUEING = 'queueing',
  PENDING = 'pending',
  RUNNING = 'running',
  FAILED = 'failed',
  SUCCESS = 'success',
}
@Entity()
export class Task {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_id' })
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.INIT,
  })
  status: string;

  @Column({
    type: 'text',
  })
  data: string;

  @Column({
    type: 'text',
  })
  resultData: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => TaskTemplate, (template) => template.tasks)
  template: TaskTemplate;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => TaskWorker)
  worker: TaskWorker;
}
