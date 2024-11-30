import express from "express";
import {
    createBook,
    updateBook,
    getBookRecord,
} from "../controller/book.controller";
import { bookUpload } from "../../../middlewares/multerConfig";
import { authenticate } from "../../../middlewares/authenticate";

const bookRouter = express.Router();

bookRouter.get("/get-books", getBookRecord);
bookRouter.post("/create-book", authenticate, bookUpload, createBook);
bookRouter.patch("/update-book/:id", bookUpload, updateBook);

export default bookRouter;
