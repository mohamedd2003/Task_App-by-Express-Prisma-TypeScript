import { prisma } from "../index.ts";
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "../schema/index.ts";
import type { Prisma } from "../generated/prisma/client.ts";

export class TaskService {
    /**
     * Paginated, filterable list of tasks
     */
    static async findAll(query: TaskQueryInput) {
        const { page, limit, status, priority, category, archived, ownerId, search, sortBy, order } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.TaskWhereInput = {
            archived,
        };

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (category) where.category = category;
        if (ownerId) where.ownerId = ownerId;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy!]: order },
                include: {
                    owner: { select: { id: true, name: true } },
                    _count: { select: { comments: true } },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return {
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Single task with full details, owner, and comments timeline
     */
    static async findById(id: number) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, name: true } },
                comments: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    /**
     * Create a new task
     */
    static async create(data: CreateTaskInput) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                category: data.category,
                startDate: data.startDate,
                dueDate: data.dueDate,
                ownerId: data.ownerId,
            },
            include: {
                owner: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * Update task fields
     */
    static async update(id: number, data: UpdateTaskInput) {
        return prisma.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                category: data.category,
                startDate: data.startDate,
                dueDate: data.dueDate,
                ownerId: data.ownerId,
            },
            include: {
                owner: { select: { id: true, name: true } },
                comments: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    /**
     * Soft archive a task
     */
    static async archive(id: number) {
        return prisma.task.update({
            where: { id },
            data: { archived: true },
            include: {
                owner: { select: { id: true, name: true } },
            },
        });
    }
}
