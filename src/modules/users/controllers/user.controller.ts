import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createUser(req.body);
        res.status(result?.statusCode).json({
            success: result.success,
            message: result?.message,
            accessTokent: result?.token,
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.loginUser(req.body);
        res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            accessToken: result.token,
        });
    } catch (error) {
        next(error);
    }
};

export { createUser, loginUser };
