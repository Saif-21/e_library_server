import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createUser(req.body);
        if (result?.success) {
            res.status(result?.statusCode).json({
                success: true,
                message: result?.message,
                user: result?.user,
            });
        }
    } catch (error) {
        next(error);
    }
};

export { createUser };
