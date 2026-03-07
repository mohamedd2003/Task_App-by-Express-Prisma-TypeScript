import { z } from "zod/v4";

//  Enums─

export const Status = z.enum(["BACKLOG", "IN_PROGRESS", "BLOCKED", "DONE"]);
export type Status = z.infer<typeof Status>;

export const Priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type Priority = z.infer<typeof Priority>;

export const Category = z.enum(["BACKEND", "FRONTEND", "DEVOPS"]);
export type Category = z.infer<typeof Category>;

//  Task Schemas

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(2000).optional(),
    status: Status.optional().default("BACKLOG"),
    priority: Priority.optional().default("MEDIUM"),
    category: Category.optional().default("BACKEND"),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    ownerId: z.number().int().positive().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255).optional(),
    description: z.string().max(2000).optional().nullable(),
    status: Status.optional(),
    priority: Priority.optional(),
    category: Category.optional(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
    ownerId: z.number().int().positive().optional().nullable(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

//  Task Query Filters ─

export const taskQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: Status.optional(),
    priority: Priority.optional(),
    category: Category.optional(),
    archived: z.coerce.boolean().optional().default(false),
    ownerId: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "startDate", "dueDate", "priority", "status", "category", "title"]).optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

//  Route Param Schemas

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive integer"),
});
export type IdParam = z.infer<typeof idParamSchema>;

//  Comment Schemas 

export const createCommentSchema = z.object({
    message: z.string().min(1, "Message is required").max(2000),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

//  User Schemas

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
