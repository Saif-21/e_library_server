import { config as conf } from "dotenv";
conf();

const _config = {
    port: process.env.PORT || 8000,
};

export const config = Object.freeze(_config);
