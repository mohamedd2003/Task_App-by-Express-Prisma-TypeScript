import { HttpException } from "../exceptions/root.ts";
import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode,
            ...(err.errors && { errors: err.errors }),
        });
        return;
    }

    // Unexpected errors — don't leak stack traces
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal server error",
        errorCode: 5000,
    });
};