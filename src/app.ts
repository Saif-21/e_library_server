import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import ApiError from "./utils/apiError";

const app = express();

app.get("/", (req: Request, res: Response) => {
    // throw new ApiError(500, "Something went wrong");
    res.send({ message: "Welcome to e libaray apis." });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
