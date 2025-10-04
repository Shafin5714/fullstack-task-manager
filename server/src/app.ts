import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

export default app;
