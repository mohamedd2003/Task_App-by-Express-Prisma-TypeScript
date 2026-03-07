import { prisma } from "../index.ts";
import type { CreateCommentInput } from "../schema/index.ts";

export class CommentService {
    /**
     * Add a comment to a task
     */
    static async create(taskId: number, data: CreateCommentInput) {
        return prisma.comment.create({
            data: {
                message: data.message,
                taskId,
            },
        });
    }

    /**
     * Get all comments for a task (activity timeline)
     */
    static async findByTaskId(taskId: number) {
        return prisma.comment.findMany({
            where: { taskId },
            orderBy: { createdAt: "asc" },
        });
    }
}
