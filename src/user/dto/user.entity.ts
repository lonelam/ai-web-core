import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
  JoinTable,
} from 'typeorm';
import { Authority } from './authority.entity';
import { IPublicUser } from './user.interface';
export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  TASK_SLAVE = 'task_slave',
  ANONYMOUS = 'anonymous',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_id' })
  id: number;

  @Index('IDX_EMAIL', { unique: true })
  @Column()
  email: string;

  @Index('IDX_USER_NAME', { unique: true })
  @Column()
  userName: string;

  @Index('IDX_PHONE', { unique: true })
  @Column({
    nullable: true,
    default: null,
  })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  secretAuthPasswd: string;

  @CreateDateColumn()
  createTime: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ANONYMOUS,
  })
  role: UserRole;

  @OneToMany(() => Authority, (authority) => authority.owner, {
    eager: true,
    cascade: true,
  })
  authorities: Authority[];

  get authorityKeys(): string[] {
    if (!this.authorities) {
      return [];
    }
    return this.authorities.map((a) => a.featureKey);
  }

  getPublicData(): IPublicUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      phone: this.phone,
      role: this.role,
      authorityKeys: this.authorityKeys,
    };
  }
}
