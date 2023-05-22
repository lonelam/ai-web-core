declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    BCRYPT_SALT: string;
    JWT_SECRET: string;
    ALIYUN_ACCESS_KEY_ID: string;
    ALIYUN_ACCESS_KEY_SECRET: string;
    SUPER_USER_INIT_PASSWORD: string;
  }
}
