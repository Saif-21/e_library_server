import { config as conf } from "dotenv";
conf();

const _config = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    SALT_SIZE: process.env.SALT_SIZE,
};

export const config = Object.freeze(_config);
