import express from "express";
import { createBook } from "../controller/book.controller";
import { bookUpload } from "../../../middlewares/multerConfig";
import { authenticate } from "../../../middlewares/authenticate";

const bookRouter = express.Router();

bookRouter.post("/create-book", authenticate, bookUpload, createBook);

export default bookRouter;
