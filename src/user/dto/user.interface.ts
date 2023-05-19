import { User } from './user.entity';

export type IRegisterUser = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'userName'
> &
  Partial<Pick<User, 'phone'>> & {
    password: string;
  };

export type IPublicUser = Pick<
  User,
  | 'id'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'role'
  | 'userName'
  | 'authorityKeys'
>;
