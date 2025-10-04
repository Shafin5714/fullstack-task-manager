import app from "./app";
import "colors";
import dotenv from "dotenv";
import { connectDB } from "./db/mongoose";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// connecting to Database
connectDB();

app.listen(PORT, () => {
  console.log(`API listening on PORT:${PORT}`.yellow.bold);
});
