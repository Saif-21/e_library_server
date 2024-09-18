import express from "express";
import { createBook } from "../controller/book.controller";
import { bookUpload } from "../../../middlewares/multerConfig";

const bookRouter = express.Router();

bookRouter.post("/create-book", bookUpload, createBook);

export default bookRouter;
