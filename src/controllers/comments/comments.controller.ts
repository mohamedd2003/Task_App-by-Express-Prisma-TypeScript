import type { Request, Response, NextFunction } from "express";
import { CommentService } from "../../services/comments.service.ts";
import { TaskService } from "../../services/tasks.service.ts";
import { NotFoundException } from "../../exceptions/not_found.ts";
import { ErrorCode } from "../../exceptions/root.ts";
import type { CreateCommentInput, IdParam } from "../../schema/index.ts";

/**
 * POST /api/tasks/:id/comments — Add a comment to a task
 */
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: taskId } = res.locals.validated.params as IdParam;

        // Verify task exists
        const task = await TaskService.findById(taskId);
        if (!task) {
            throw new NotFoundException("Task not found", ErrorCode.TASK_NOT_FOUND);
        }

        const data = req.body as CreateCommentInput;
        const comment = await CommentService.create(taskId, data);
        res.status(201).json({ data: comment });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/:id/comments — List comments for a task
 */
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: taskId } = res.locals.validated.params as IdParam;

        const task = await TaskService.findById(taskId);
        if (!task) {
            throw new NotFoundException("Task not found", ErrorCode.TASK_NOT_FOUND);
        }

        const comments = await CommentService.findByTaskId(taskId);
        res.json({ data: comments });
    } catch (err) {
        next(err);
    }
};
