import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import routes from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use(routes);

// 404
app.use(notFound);

// error handler
app.use(errorHandler);

export default app;
