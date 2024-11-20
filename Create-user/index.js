import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import connectDB from "./DB/database.js";
import authRoutes from "./routes/authRouter.js";

// creating server with express
const port = process.env.PORT;
const app = express();
// Connect DB
connectDB();
//calling it to use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRoutes);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
