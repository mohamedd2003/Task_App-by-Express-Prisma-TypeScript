import express from "express";
import { PORT } from "./secrets.ts";
import rootRouter from "./routes/index.ts";
import { errorMiddleware } from "./middlewares/error.ts";

import cors from "cors"
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const app = express();

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json());

// ── CORS (allow all origins for dev) ───────────────────────────
app.use(cors({
  origin: ["https://task-app-by-next-type-script.vercel.app","http://178.104.123.180:3000/",
    
  ], 
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
}));


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