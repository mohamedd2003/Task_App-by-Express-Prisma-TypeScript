import express, { type Router } from "express";
import { validate } from "../../middlewares/validate.ts";
import { createTaskSchema, updateTaskSchema, taskQuerySchema, createCommentSchema, idParamSchema } from "../../schema/index.ts";
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    archiveTask,
} from "../../controllers/tasks/tasks.controller.ts";
import { addComment, getComments } from "../../controllers/comments/comments.controller.ts";

const tasksRouter: Router = express.Router();

// ── Task Routes ────────────────────────────────────────────────
tasksRouter.get("/", validate(taskQuerySchema, "query"), getAllTasks);
tasksRouter.get("/:id", validate(idParamSchema, "params"), getTaskById);
tasksRouter.post("/", validate(createTaskSchema), createTask);
tasksRouter.patch("/:id", validate(idParamSchema, "params"), validate(updateTaskSchema), updateTask);
tasksRouter.patch("/:id/archive", validate(idParamSchema, "params"), archiveTask);

// ── Comment Routes (nested under tasks) ────────────────────────
tasksRouter.post("/:id/comments", validate(idParamSchema, "params"), validate(createCommentSchema), addComment);
tasksRouter.get("/:id/comments", validate(idParamSchema, "params"), getComments);

export default tasksRouter;