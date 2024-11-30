import path from "node:path";
import fs from "node:fs";
import CloudinaryConnection from "../../../config/cloudinary";
import { BookData, BookRecordData, RequestFileData } from "../types/book.types";
import ApiError from "../../../utils/apiError";
import { Books } from "../../../entity/Books";
import { appDataSource } from "../../../config/db";
import {
    BookRecordBodySchema,
    BookRecordModifyBodySchema,
} from "../../../middlewares/validator";
import { AuthRequest } from "../../../middlewares/authenticate";
import { Request } from "express";
import { extractPublicId } from "../../../utils/helper";

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
    async createBookRecord(
        req: Request,
        files: BookData,
        data: BookRecordData
    ) {
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

        // Upload files concurrently
        const [coverImageUploadData, bookPdfUpladData] = await Promise.all([
            this.uploadFilesToCloudService(
                coverImageData,
                this.BOOK_COVER_IMAGE
            ),
            this.uploadFilesToCloudService(bookPdfData, this.BOOK_PDF),
        ]);

        // Ensure that upload data is valid
        const coverImage =
            typeof coverImageUploadData === "string"
                ? coverImageUploadData
                : undefined;

        const pdfPath =
            typeof bookPdfUpladData === "string" ? bookPdfUpladData : undefined;

        if (coverImage && pdfPath) {
            const _req = req as AuthRequest; // Interface for userId

            const result: Books = await this.booksRepository.create({
                title: data.title,
                author: data.author,
                uploadBy: _req.userId,
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
     * Update Book record
     *
     * @param req
     *
     * return Object
     */
    async updateBook(req: Request) {
        const id = req.params.id;
        const bookRecord = await this.getBookById(parseInt(id));

        if (!bookRecord) {
            throw ApiError.dataNotExist("Record not exist.");
        }

        const data = req.body;
        const files = req.files as BookData;
        const validationObject = { ...data };

        if (files) {
            if (files.coverImage) {
                validationObject.coverImage = {
                    originalname: files.coverImage[0].originalname,
                    mimetype: files.coverImage[0].mimetype,
                    size: files.coverImage[0].size,
                };
            }

            if (files.bookPdf) {
                validationObject.bookPdf = {
                    originalname: files.bookPdf[0].originalname,
                    mimetype: files.bookPdf[0].mimetype,
                    size: files.bookPdf[0].size,
                };
            }
        }

        const { error } = BookRecordModifyBodySchema.validate(validationObject);

        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }

        let coverImageUploadData: string | boolean = false;
        let bookPdfUpladData: string | boolean = false;
        const preCoverImgUrl = bookRecord.coverImage;
        const prepdfPath = bookRecord.pdfPath;
        if (files) {
            if (files.coverImage) {
                const coverImageData = files.coverImage[0];
                coverImageUploadData = await this.uploadFilesToCloudService(
                    coverImageData,
                    this.BOOK_COVER_IMAGE
                );
            }

            if (files.bookPdf) {
                const bookPdfData = files.bookPdf[0];
                bookPdfUpladData = await this.uploadFilesToCloudService(
                    bookPdfData,
                    this.BOOK_PDF
                );
            }
        }

        // Ensure that upload data is valid
        const coverImage =
            typeof coverImageUploadData === "string"
                ? coverImageUploadData
                : undefined;

        const pdfPath =
            typeof bookPdfUpladData === "string" ? bookPdfUpladData : undefined;

        let updatedBookRecord = {
            title: data.title,
            author: data.author,
            uploadBy: bookRecord.uploadBy,
            genre: data.genre,
            description: data.description,
            publishedDate: new Date(data.publishedDate),
            isAvailable: bookRecord.isAvailable,
        };

        if (coverImage || pdfPath) {
            updatedBookRecord = {
                ...updatedBookRecord,
                ...(coverImage && { coverImage: coverImage }),
                ...(pdfPath && { pdfPath: pdfPath }),
            };
        }

        const result = await this.booksRepository.update(id, updatedBookRecord);

        // Delete Media from cloudnary
        if (coverImage || pdfPath) {
            if (coverImage) {
                this.deleteMediaByUrl(preCoverImgUrl);
            }
            if (pdfPath) {
                this.deleteMediaByUrl(prepdfPath);
            }
        }

        if (result) {
            return {
                success: true,
                statusCode: 201,
                message: "Book record updated successfully.",
            };
        }

        return {
            success: false,
            statusCode: 500,
            message: "Something went wrong while updating book record.",
        };
    }

    /**
     * Retrieve book records.
     *
     * If an ID is provided, fetch a specific book record by ID.
     * Otherwise, fetch all book records.
     *
     * @param id - The ID of the book to fetch, or false to fetch all books.
     * @returns An object containing the success status, HTTP status code,
     *          a message, and the retrieved book data.
     */

    async getBookRecord(id?: number) {
        try {
            const bookRecords = id
                ? await this.getBookById(id)
                : await this.booksRepository.find();

            if (!bookRecords) {
                return {
                    success: false,
                    statusCode: 404,
                    message: id
                        ? "Book record not found."
                        : "Book record(s) not found.",
                };
            }

            return {
                success: true,
                statusCode: 200,
                message: id
                    ? "Book record fetched successfully."
                    : "Book record(s) fetched successfully.",
                data: bookRecords,
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: id
                    ? "Something went wrong while fetching book record."
                    : "Something went wrong while fetching book record(s).",
            };
        }
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

            // Delete temp images
            await fs.promises.unlink(filePath);

            if (uploadResult) {
                return uploadResult.secure_url;
            }

            return false;
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong while uploading files.";

            throw ApiError.internalServer(errorMessage);
        }
    }

    async getBookById(idBook: number) {
        try {
            return await this.booksRepository.findOne({
                where: { id: idBook },
            });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteMediaByUrl(url?: string) {
        try {
            const publicId = extractPublicId(url);
            if (publicId) {
                const response = await this.cloudinary.uploader.destroy(
                    // publicId
                    "cover-images/brvv842o2brpa82o5o1w"
                );

                if (response.result !== "ok") {
                    return {
                        status: false,
                        message: "An error occurred while deleting the media.",
                    };
                }

                return true;
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting media.";

            throw ApiError.internalServer(errorMessage);
        }
    }
}

const bookService = new BookService();

export { bookService };
