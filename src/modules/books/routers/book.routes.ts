import express from "express";
import { createBook } from "../controller/book.controller";

const bookRouter = express.Router();

bookRouter.get("/create-book", createBook);

export default bookRouter;
