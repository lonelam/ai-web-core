import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
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
  @Index('IDX_NAME', { unique: true })
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

  @ApiProperty()
  @Column()
  visible: boolean;

  @OneToMany(() => Task, (task) => task.template)
  tasks: Task[];

  @UpdateDateColumn()
  updateTime: Date;

  @DeleteDateColumn({
    default: () => 'NULL',
    nullable: true,
  })
  deleteTime: Date;

  @ApiProperty()
  @OneToOne(() => TaskTemplateMeta, (meta) => meta.template, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'FK_meta' })
  meta: TaskTemplateMeta;
}
