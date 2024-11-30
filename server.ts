import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";
import { EventEmitter } from "events";

const startServer = async () => {
    EventEmitter.defaultMaxListeners = 20;
    // Connect Database
    await connectDb();
    const port = config.PORT;

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
};

startServer();
