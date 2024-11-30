import express from "express";
import { createBook, updateBook } from "../controller/book.controller";
import { bookUpload } from "../../../middlewares/multerConfig";
import { authenticate } from "../../../middlewares/authenticate";

const bookRouter = express.Router();

bookRouter.post("/create-book", authenticate, bookUpload, createBook);
bookRouter.patch("/update-book/:id", bookUpload, updateBook);

export default bookRouter;
