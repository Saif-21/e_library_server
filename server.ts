import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";

const startServer = async () => {
    // Connect Database
    await connectDb();
    const port = config.PORT;

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
};

startServer();
