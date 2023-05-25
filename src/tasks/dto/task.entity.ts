import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_id' })
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.INIT,
  })
  status: TaskStatus;

  @ApiProperty()
  @Column({
    type: 'text',
  })
  data: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  resultData: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
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

  @ApiProperty()
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

  @Column({ nullable: true })
  workerId: number;
}
export type IPublicTask = Omit<Task, 'worker' | 'template' | 'creator'>;
