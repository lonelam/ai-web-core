import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskTemplate } from './taskTemplate.entity';

@Entity()
export class TaskTemplateMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TaskTemplate, (t) => t.meta)
  template: TaskTemplate;

  @Column()
  image: string;

  @Column()
  description: string;
}
