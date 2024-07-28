import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send({ message: "Welcome to e libaray apis." });
});

export default app;
