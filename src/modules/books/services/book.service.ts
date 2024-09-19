import path from "node:path";
import cloudinary from "../../../config/cloudinary";
import { BookData } from "../types/book.types";

class BookService {
    // createBook(data: object) {
    //     return {
    //         success: true,
    //         statusCode: 201,
    //         message: "User created successfully.",
    //         token: "",
    //     };
    // }

    async createBookRecord(files: BookData) {
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
    }
}

const bookService = new BookService();

export { bookService };

/*
TODO
# Book Table fields
- id
- title
- auther - related to USER
- genre
- coverImage
- file
- createdAt
- updatedAt 
*/
