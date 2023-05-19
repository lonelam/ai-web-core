import { SetMetadata } from '@nestjs/common';
export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ||
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const passwdSalt =
  process.env.BCRYPT_SALT ||
  '$2b$10$VB3sOORci61TGQtq7vqI0OdqmD22381d07I4nJjN1RAxLn75.dpza';
export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ADMIN_KEY = 'isAdmin';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);
