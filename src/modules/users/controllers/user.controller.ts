import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createUser("saif");
        res.send({ msg: "Registration" });
    } catch (error) {
        next(error);
    }
};

export { createUser };
