import type { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import { ValidationException } from "../exceptions/validation.ts";

/**
 * Middleware factory: validates req.body | req.query | req.params against a Zod schema.
 * Parsed (coerced / defaulted) values are stored in res.locals.validated[source].
 * For body/params the original req property is also updated.
 */
export function validate(schema: z.ZodType, source: "body" | "query" | "params" = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const fieldErrors: Record<string, string[]> = {};
            for (const issue of result.error.issues) {
                const path = issue.path.join(".") || "_root";
                if (!fieldErrors[path]) fieldErrors[path] = [];
                fieldErrors[path].push(issue.message);
            }
            throw new ValidationException("Validation failed", fieldErrors);
        }

        // Always store parsed values in res.locals so controllers can access them
        if (!res.locals.validated) res.locals.validated = {};
        res.locals.validated[source] = result.data;

        // For body and params we can also update the original req property
        if (source === "body") {
            req.body = result.data;
        }

        next();
    };
}
