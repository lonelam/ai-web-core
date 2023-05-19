import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Authority {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_id' })
  id: string;

  @Column()
  featureKey: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => User, (user) => user.authorities)
  owner: User;
}
