import app from "./src/app";
import { config } from "./src/config/config";

const startServer = () => {
    const port = config.PORT;

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
};

startServer();
