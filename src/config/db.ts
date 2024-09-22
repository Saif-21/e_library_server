import { DataSource } from "typeorm";
import { config } from "./config";
import { User } from "../entity/User";
import { Books } from "../entity/Books";

export const appDataSource = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    entities: [User, Books],
});

const connectDb = async () => {
    try {
        await appDataSource.initialize();
        console.log(`Database connection established...`);
    } catch (err) {
        console.error("Error establishing database connection:", err);
        process.exit(1); // Exit the process with failure code
    }
};

export default connectDb;
