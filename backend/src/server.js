import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ QuizGen backend running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
