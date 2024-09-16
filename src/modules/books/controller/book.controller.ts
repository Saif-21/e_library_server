import { Request, Response, NextFunction } from "express";
import { bookService } from "../services/book.service";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = bookService.createBook(req.body);
        res.status(result?.statusCode).json({
            success: result?.success,
            message: result?.message,
            accessTokent: "",
        });
    } catch (error) {
        next(error);
    }
};

export { createBook };
