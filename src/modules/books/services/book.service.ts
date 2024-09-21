import path from "node:path";
import cloudinary from "../../../config/cloudinary";
import { BookData, RequestFileData } from "../types/book.types";
import ApiError from "../../../utils/apiError";

class BookService {
    private BOOK_COVER_IMAGE = "cover";
    private BOOK_PDF = "pdf";
    private BOOK_COVER_IMAGE_FOLDER_NAME = "cover-images";
    private BOOK_PDF_FOLDER_NAME = "book-pdfs";
    // createBook(data: object) {
    //     return {
    //         success: true,
    //         statusCode: 201,
    //         message: "User created successfully.",
    //         token: "",
    //     };
    // }

    async createBookRecord(files: BookData) {
        const coverImageUploadData = await this.uploadFilesToCloudService(
            files.coverImage[0],
            this.BOOK_COVER_IMAGE
        );

        // const bookPdfUpladData = await this.uploadFilesToCloudService(
        //     files.bookPdf[0],
        //     this.BOOK_PDF
        // );

        // console.log(bookPdfUpladData);
        console.log(coverImageUploadData);
    }

    private async uploadFilesToCloudService(
        file: RequestFileData,
        filetype: string
    ) {
        try {
            const fileName = file.filename;
            const coverImageMimeType = file.mimetype.split("/").at(-1);
            const filePath = path.resolve(
                __dirname,
                "../../../../public/data/uploads",
                fileName
            );
            let folderName = "";
            if (filetype === this.BOOK_COVER_IMAGE) {
                folderName = this.BOOK_COVER_IMAGE_FOLDER_NAME;
            }

            const uploadResult = await cloudinary.uploader.upload(filePath, {
                filename_override: fileName,
                folder: folderName,
                format: coverImageMimeType,
            });

            if (uploadResult) {
                return uploadResult.secure_url;
            }

            return false;
        } catch (error) {
            console.log(error);
            let errorMessage = "Something went wrong while uploading files.";
            if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            } else if (typeof error === "string") {
                errorMessage = error;
            } else if (
                error &&
                typeof error === "object" &&
                "message" in error
            ) {
                errorMessage = (error as { message: string }).message;
            }

            throw ApiError.internalServer(errorMessage);
        }
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
