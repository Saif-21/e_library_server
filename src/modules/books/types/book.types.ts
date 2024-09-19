export interface BookData {
    coverImage: Express.Multer.File[];
    [key: string]: Express.Multer.File[];
}
