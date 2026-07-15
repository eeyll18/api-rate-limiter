import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API working." });
});

app.listen(PORT, () => {
  console.log("working on port:", PORT);
});
