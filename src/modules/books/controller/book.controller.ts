import { Request, Response, NextFunction } from "express";
import { bookService } from "../services/book.service";
import { BookData } from "../types/book.types";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as BookData;
        const result = await bookService.createBookRecord(req, files, req.body);
        res.status(result?.statusCode).json({
            success: result.success,
            message: result?.message,
        });
    } catch (error) {
        next(error);
    }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await bookService.updateBook(req);
        res.status(result?.statusCode).json({
            success: result.success,
            message: result?.message,
        });
    } catch (error) {
        next(error);
    }
};

export { createBook, updateBook };
