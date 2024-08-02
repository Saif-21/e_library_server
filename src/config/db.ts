import { DataSource } from "typeorm";
import { config } from "./config";

const connectDb = async () => {
    try {
        const appDataSource = new DataSource({
            type: "mysql",
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            database: config.DB_PASSWORD,
        });

        await appDataSource.initialize().then(() => {
            console.log(`Database connection established...`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDb;
