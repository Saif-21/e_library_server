import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./modules/users/routers/user.routes";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send({ message: "Welcome to e libaray apis." });
});

// User Auth Router
app.use("/api/v1/user", userRouter);
// Global Error Handler
app.use(globalErrorHandler);

export default app;
