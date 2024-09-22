import multer from "multer";
import path from "node:path";

const bookStorage = multer.diskStorage({
    destination: path.resolve(__dirname, "../../public/data/uploads"),
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname.split(" ").join("_"));
    },
});

const bookUpload = multer({
    storage: bookStorage,
    limits: { fileSize: 30e7 }, // 30 mb 30 * 1024 * 1024 ...
}).fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookPdf", maxCount: 1 },
]);

export { bookUpload };
