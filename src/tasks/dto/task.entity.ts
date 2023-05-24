import { User } from 'src/user/dto/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  status: TaskStatus;

  @Column({
    type: 'text',
  })
  data: string;

  @Column({
    type: 'text',
    nullable: true,
    default: () => 'NULL',
  })
  resultData: string;

  @Column({
    type: 'text',
    nullable: true,
    default: () => 'NULL',
  })
  progressData: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => TaskTemplate, (template) => template.tasks, {
    nullable: false,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_template',
    name: 'templateId',
  })
  template: TaskTemplate;

  @Column()
  templateId: number;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'FK_creator' })
  creator: User;

  @ManyToOne(() => TaskWorker)
  @JoinColumn({
    foreignKeyConstraintName: 'FK_worker',
    name: 'workerId',
  })
  worker: TaskWorker;

  @Column({ nullable: true, default: () => 'NULL' })
  workerId: number;
}
export type IPublicTask = Omit<Task, 'worker' | 'template' | 'creator'>;
