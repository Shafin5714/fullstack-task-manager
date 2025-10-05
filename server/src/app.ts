import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import routes from "./routes/index";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// routes
app.use(routes);

// 404
app.use(notFound);

// error handler
app.use(errorHandler);

export default app;
