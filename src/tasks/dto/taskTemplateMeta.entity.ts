import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTemplate } from './taskTemplate.entity';

@Entity()
export class TaskTemplateMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TaskTemplate, (t) => t.meta, { nullable: false })
  template: TaskTemplate;

  @ApiProperty()
  @Column()
  image: string;

  @ApiProperty()
  @Column()
  description: string;
}
