import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.authorities, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'FK_owner', name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;
}
