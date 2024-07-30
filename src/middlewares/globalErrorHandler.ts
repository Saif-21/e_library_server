import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { config } from "../config/config";
const globalErrorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return res.json({
        success: false,
        message: err.message,
        stacktrace: config.NODE_ENV === "development" ? err.stack : "",
    });
};

export default globalErrorHandler;
