import express from "express";
import cors from "cors";
import { database_connection } from "./config/db";
import { URI } from "./config/uri";
// routes
import authRoutes from "./routes/auth";
const app = express();
const port = process.env.PORT || 3000;

database_connection(URI);

app.use(cors());
app.use(express.json());

// use routes
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`server is running on port: ${port}`));
