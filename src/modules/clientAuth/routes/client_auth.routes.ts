import express, { Application } from "express";
import { userSchema } from "../../../middlewares/validator";
import ApiError from "../../../utils/apiError";

const clientAuthRoutes = (server: Application) => {
    const userRouter = express.Router();

    userRouter.post("/register", async (req, res, next) => {
        console.log(req.body);
        // console.log(await userSchema.validateAsync(req.body));

        const { error, value } = await userSchema.validate(req.body);
        if (error) {
            console.log(error);
        }
        console.log(error);
        console.log(value);

        res.send("Register endpoint");
    });

    server.use("/api/v1/client", userRouter);
};

export default clientAuthRoutes;
