import path from "node:path";
import CloudinaryConnection from "../../../config/cloudinary";
import { BookData, RequestFileData } from "../types/book.types";
import ApiError from "../../../utils/apiError";

class BookService {
    private cloudinary = CloudinaryConnection.getInstance();
    private BOOK_COVER_IMAGE = "cover";
    private BOOK_PDF = "pdf";
    private BOOK_COVER_IMAGE_FOLDER_NAME = "cover-images";
    private BOOK_PDF_FOLDER_NAME = "book-pdfs";

    async createBookRecord(files: BookData) {
        const coverImageUploadData = await this.uploadFilesToCloudService(
            files.coverImage[0],
            this.BOOK_COVER_IMAGE
        );
        const bookPdfUpladData = await this.uploadFilesToCloudService(
            files.bookPdf[0],
            this.BOOK_PDF
        );

        console.log(bookPdfUpladData);
        console.log(coverImageUploadData);
    }

    private async uploadFilesToCloudService(
        file: RequestFileData,
        filetype: string
    ) {
        try {
            const fileName = file.filename;
            const fileMimeType = file.mimetype.split("/").at(-1);
            const filePath = path.resolve(
                __dirname,
                "../../../../public/data/uploads",
                fileName
            );
            let folderName = "";
            if (filetype === this.BOOK_COVER_IMAGE) {
                folderName = this.BOOK_COVER_IMAGE_FOLDER_NAME;
            }

            if (filetype === this.BOOK_PDF) {
                folderName = this.BOOK_PDF_FOLDER_NAME;
            }

            let preparedUploadData = {};
            if (filetype === this.BOOK_COVER_IMAGE) {
                preparedUploadData = {
                    filename_override: fileName,
                    folder: folderName,
                    format: fileMimeType,
                };
            }

            if (filetype === this.BOOK_PDF) {
                preparedUploadData = {
                    resours_type: "raw",
                    filename_override: fileName,
                    folder: folderName,
                    format: fileMimeType,
                };
            }

            const uploadResult = await this.cloudinary.uploader.upload(
                filePath,
                preparedUploadData
            );

            if (uploadResult) {
                return uploadResult.secure_url;
            }

            return false;
        } catch (error) {
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
