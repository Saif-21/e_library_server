import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { decodeJwtToken } from "../utils/helper";
import { config } from "../config/config";

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

        // if (tokenData) {
        //     req.userId = tokenData.id;
        // }
    } catch (error) {
        return next(new ApiError(401, "Token expired or invalid."));
    }
};
