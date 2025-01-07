import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./modules/users/routers/user.routes";
import bookRouter from "./modules/books/routers/book.routes";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(express.json());

app.get("/api/v1/", (req: Request, res: Response) => {
    res.send({ message: "Welcome to e libaray apis." });
});

// User Auth Router
app.use("/api/v1/users", userRouter);
// Book Router
app.use("/api/v1/books", bookRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
