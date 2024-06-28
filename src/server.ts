import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { database_connection } from "./config/db";
import { URI } from "./config/uri";
// routes
import authRoutes from "./routes/auth";

dotenv.config();

const port = process.env.PORT || 3000;
const MONGO_URI: string | undefined = process.env.MONGO_URI;
const app = express();

database_connection(MONGO_URI ?? URI);

app.use(cors());
app.use(express.json());

// use routes
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`server is running on port: ${port}`));
