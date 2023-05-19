import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @Column({
    type: 'text',
  })
  dataSchema: string;

  @Column({
    type: 'text',
  })
  resultSchema: string;

  @OneToMany(() => Task, (task) => task.template)
  tasks: Task[];

  @UpdateDateColumn()
  updateTime: Date;
}
