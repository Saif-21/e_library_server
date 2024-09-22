export interface BookData {
    coverImage: Express.Multer.File[];
    bookPdf: Express.Multer.File[];
    [key: string]: Express.Multer.File[];
}

export interface RequestFileData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export interface BookRecordData {
    title: string;
    author: string;
    genre: string;
    description: string;
    publishedDate: string;
    isAvailable: boolean;
}
