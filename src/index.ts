import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import { quotaMiddleware } from "./middleware/quota.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API working." });
});

app.get("/api/weather", quotaMiddleware, (req: Request, res: Response) => {
  res.json({
    city: "Istanbul",
    temperature: "22°C",
    condition: "Güneşli",
    message: "Bu veriyi sadece yetkili ve kotası olan kullanıcılar görebilir!",
  });
});

app.listen(PORT, () => {
  console.log("working on port:", PORT);
});
