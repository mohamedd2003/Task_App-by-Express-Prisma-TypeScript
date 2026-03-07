import { prisma } from "../index.ts";
import type { CreateUserInput } from "../schema/index.ts";

export class UserService {
    /**
     * Create a user
     */
    static async create(data: CreateUserInput) {
        return prisma.user.create({
            data: { name: data.name },
        });
    }

    /**
     * List all users
     */
    static async findAll() {
        return prisma.user.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Find user by id
     */
    static async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true },
        });
    }
}
