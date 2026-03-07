import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/users.service.ts";
import { NotFoundException } from "../../exceptions/not_found.ts";
import { ErrorCode } from "../../exceptions/root.ts";
import type { CreateUserInput, IdParam } from "../../schema/index.ts";

/**
 * POST /api/users — Create a user
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateUserInput;
        const user = await UserService.create(data);
        res.status(201).json({ data: user });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/users — List all users
 */
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.findAll();
        res.json({ data: users });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/users/:id — Get user by id
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.validated.params as IdParam;
        const user = await UserService.findById(id);

        if (!user) {
            throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
        }

        res.json({ data: user });
    } catch (err) {
        next(err);
    }
};