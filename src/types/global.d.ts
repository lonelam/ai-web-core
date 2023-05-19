declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BCRYPT_SALT: string;
      JWT_SECRET: string;
    }
  }
}
