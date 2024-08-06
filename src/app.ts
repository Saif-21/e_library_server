import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import fs from "fs";
import path from "path";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send({ message: "Welcome to e libaray apis." });
});

// Dynamic Routes
const modulesDir = path.join(__dirname, "modules");

fs.readdirSync(modulesDir).forEach(async (moduleName) => {
    try {
        const routesDir = path.join(modulesDir, moduleName, "routes");
        const routeFiles = fs.readdirSync(routesDir);
        for (const routeFile of routeFiles) {
            if (routeFile && routeFile.endsWith(".routes.ts")) {
                const routePath = path.join(routesDir, routeFile);
                const { default: moduleRoute } = await import(routePath);
                moduleRoute(app); // Use the route function
            }
        }
    } catch (error) {
        console.error(error);
    }
});
// Global Error Handler
app.use(globalErrorHandler);

export default app;
