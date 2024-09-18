import { Request, Response, NextFunction } from "express";
import path from "node:path";
import { bookService } from "../services/book.service";
import cloudinary from "../../../config/cloudinary";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const fileName = files.coverImage[0].filename;
        const coverImage = files.coverImage[0];
        const coverImageMimeType = files.coverImage[0].mimetype
            .split("/")
            .at(-1);

        const filePath = path.resolve(
            __dirname,
            "../../../../public/data/uploads",
            fileName
        );
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        });
        console.log(uploadResult);
        res.json({ msg: "status" });
        // const result = bookService.createBook(req.body);
        // res.status(result?.statusCode).json({
        //     success: result?.success,
        //     message: result?.message,
        //     accessTokent: "",
        // });
    } catch (error) {
        next(error);
    }
};

export { createBook };
