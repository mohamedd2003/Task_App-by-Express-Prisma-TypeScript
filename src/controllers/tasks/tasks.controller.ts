import type { Request, Response, NextFunction } from "express";
import { TaskService } from "../../services/tasks.service.ts";
import { UserService } from "../../services/users.service.ts";
import { NotFoundException } from "../../exceptions/not_found.ts";
import { BadRequest } from "../../exceptions/bad_request.ts";
import { ErrorCode } from "../../exceptions/root.ts";
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput, IdParam } from "../../schema/index.ts";

/**
 * GET /api/tasks — Paginated, filterable list
 */
export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query params are validated & coerced by the validate middleware, stored in res.locals
        const query = res.locals.validated.query as TaskQueryInput;
        const result = await TaskService.findAll(query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/:id — Single task with full details + activity timeline
 */
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.validated.params as IdParam;
        const task = await TaskService.findById(id);

        if (!task) {
            throw new NotFoundException("Task not found", ErrorCode.TASK_NOT_FOUND);
        }

        res.json({ data: task });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/tasks — Create a new task
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateTaskInput;

        if (data.ownerId) {
            const owner = await UserService.findById(data.ownerId);
            if (!owner) {
                throw new BadRequest("Owner not found", ErrorCode.USER_NOT_FOUND);
            }
        }

        const task = await TaskService.create(data);
        res.status(201).json({ data: task });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/tasks/:id — Update task fields
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.validated.params as IdParam;

        // Verify task exists first
        const existing = await TaskService.findById(id);
        if (!existing) {
            throw new NotFoundException("Task not found", ErrorCode.TASK_NOT_FOUND);
        }

        const data = req.body as UpdateTaskInput;

        if (data.ownerId) {
            const owner = await UserService.findById(data.ownerId);
            if (!owner) {
                throw new BadRequest("Owner not found", ErrorCode.USER_NOT_FOUND);
            }
        }

        const task = await TaskService.update(id, data);
        res.json({ data: task });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/tasks/:id/archive — Soft archive a task
 */
export const archiveTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.validated.params as IdParam;

        const existing = await TaskService.findById(id);
        if (!existing) {
            throw new NotFoundException("Task not found", ErrorCode.TASK_NOT_FOUND);
        }

        const task = await TaskService.archive(id);
        res.json({ data: task });
    } catch (err) {
        next(err);
    }
};
