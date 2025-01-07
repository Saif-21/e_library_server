import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { config } from "../config/config";
const globalErrorHandler = (
    // err: ErrorRequestHandler,
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message,
        errorStack: config.NODE_ENV === "development" ? err.stack : "",
    });

    if (err instanceof ApiError) {
        // return res.status(err.statusCode).json({
        //     success: false,
        //     message: err.message,
        // });
    }

    return res.send(err);
};

export default globalErrorHandler;
