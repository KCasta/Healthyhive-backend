import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import connectDB from "./DB/database.js";
import authRoutes from "./routes/authRouter.js";
import cors from "cors";

// creating server with express
const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://healthyhive-frontend.vercel.app"], // Allowed origins
  methods: "*",
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies or authorization headers
};
app.use(cors(corsOptions));

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
