import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const quotaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({ error: "Erişim reddedildi. key eksik." });
    }

    //   veritabanından api key'a sahip kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return res.status(401).json({ error: "Geçersiz key." });
    }

    //   plana göre limit
    const limit = user.plan === "PAID" ? 1000 : 100;

    // son istek dün ise kotayı sıfırla
    const now = new Date();
    const lastReqDate = new Date(user.lastRequest);
    let currentUsage = user.usageCount;

    if (now.toLocaleDateString() !== lastReqDate.toLocaleDateString()) {
      currentUsage = 0;
    }

    if (currentUsage >= limit) {
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", 0);

      return res.status(429).json({ error: "too many request, limit doldu." });
    }

    // limit dolmadıysa
    const newUsage = currentUsage + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        usageCount: newUsage,
        lastRequest: now,
      },
    });

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", limit - newUsage);

    next();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatasi." });
  }
};
