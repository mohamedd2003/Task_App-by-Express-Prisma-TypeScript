import express from "express";
import { PORT } from "./secrets.ts";
import rootRouter from "./routes/index.ts";
import { errorMiddleware } from "./middlewares/error.ts";

import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const app = express();

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json());

// ── CORS (allow all origins for dev) ───────────────────────────
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (_req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

// ── Routes ─────────────────────────────────────────────────────
app.use("/api", rootRouter);

// ── Error handler (must be AFTER routes) ───────────────────────
app.use(errorMiddleware);

// ── Prisma client ──────────────────────────────────────────────
const adapter = new PrismaBetterSqlite3({
    url: "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(` ===> Server is running on port ${PORT} <=== `);
});