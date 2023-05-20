import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { TaskTemplateMeta } from './taskTemplateMeta.entity';

@Entity()
export class TaskTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @ApiProperty()
  @Column({
    type: 'text',
  })
  dataSchema: string;

  @ApiProperty()
  @Column({
    type: 'text',
  })
  resultSchema: string;

  @OneToMany(() => Task, (task) => task.template)
  tasks: Task[];

  @UpdateDateColumn()
  updateTime: Date;

  @DeleteDateColumn()
  deleteTime: Date;

  @OneToOne(() => TaskTemplateMeta, (meta) => meta.template, { cascade: true })
  meta: TaskTemplateMeta;
}
