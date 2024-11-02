import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { decodeJwtToken } from "../utils/helper";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: number;
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return next(
                ApiError.unAuthorizedAccess("Authorization token is required")
            );
        }

        const tokenData = decodeJwtToken(
            token.split(" ")[1],
            config.JWT_SECRET
        );

        if (tokenData && typeof tokenData != "string") {
            const _req = req as AuthRequest;
            _req.userId = tokenData.id as number;
            next();
        }
    } catch (error) {
        return next(new ApiError(401, "Token expired or invalid."));
    }
};
