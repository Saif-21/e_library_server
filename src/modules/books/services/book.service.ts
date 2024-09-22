import path from "node:path";
import CloudinaryConnection from "../../../config/cloudinary";
import { BookData, BookRecordData, RequestFileData } from "../types/book.types";
import ApiError from "../../../utils/apiError";
import { Books } from "../../../entity/Books";
import { appDataSource } from "../../../config/db";
import { BookRecordBodySchema } from "../../../middlewares/validator";

class BookService {
    private cloudinary = CloudinaryConnection.getInstance();
    private BOOK_COVER_IMAGE = "cover";
    private BOOK_PDF = "pdf";
    private BOOK_COVER_IMAGE_FOLDER_NAME = "cover-images";
    private BOOK_PDF_FOLDER_NAME = "book-pdfs";
    private booksRepository = appDataSource.getRepository(Books);

    /**
     * Create new book record.
     *
     * @param files
     * @param data
     * @return Object
     */
    async createBookRecord(files: BookData, data: BookRecordData) {
        const coverImageData = files.coverImage[0];
        const bookPdfData = files.bookPdf[0];

        // Joi Validation
        const { error } = BookRecordBodySchema.validate({
            ...data,
            coverImage: {
                originalname: coverImageData?.originalname,
                mimetype: coverImageData?.mimetype,
                size: coverImageData?.size,
            },
            bookPdf: {
                originalname: bookPdfData?.originalname,
                mimetype: bookPdfData?.mimetype,
                size: bookPdfData?.size,
            },
        });

        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }

        // Upload Cover Image
        const coverImageUploadData = await this.uploadFilesToCloudService(
            coverImageData,
            this.BOOK_COVER_IMAGE
        );

        // Upload PDF file
        const bookPdfUpladData = await this.uploadFilesToCloudService(
            bookPdfData,
            this.BOOK_PDF
        );

        // Ensure that upload data is valid
        const coverImage =
            typeof coverImageUploadData === "string"
                ? coverImageUploadData
                : undefined;

        const pdfPath =
            typeof bookPdfUpladData === "string" ? bookPdfUpladData : undefined;

        if (pdfPath) {
            const result: Books = await this.booksRepository.create({
                title: data.title,
                author: data.author,
                uploadBy: 1,
                genre: data.genre,
                description: data.description,
                publishedDate: new Date(data.publishedDate),
                coverImage: coverImage,
                pdfPath: pdfPath,
                isAvailable: true,
            });
            await this.booksRepository.save(result);
            // Return success if book created
            return {
                success: true,
                statusCode: 201,
                message: "Book record created successfully.",
            };
        }

        return {
            success: false,
            statusCode: 500,
            message: "Something went wrong while creating book record.",
        };
    }

    /**
     * Upload Files to cloudnary
     *
     * @param file
     * @param filetype
     * @return string || boolean
     */
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
