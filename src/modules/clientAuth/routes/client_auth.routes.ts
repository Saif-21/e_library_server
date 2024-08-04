import express, { Application } from "express";

const clientAuthRoutes = (server: Application) => {
    const userRouter = express.Router();

    userRouter.get("/register", (req, res) => {
        res.send("Register endpoint");
    });

    server.use("/api/v1/client", userRouter);
};

export default clientAuthRoutes;
