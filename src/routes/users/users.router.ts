import express, { type Router } from "express";
import { validate } from "../../middlewares/validate.ts";
import { createUserSchema, idParamSchema } from "../../schema/index.ts";
import { createUser, getUsers, getUserById } from "../../controllers/users/users.controller.ts";

const userRouter: Router = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", validate(idParamSchema, "params"), getUserById);
userRouter.post("/", validate(createUserSchema), createUser);

export default userRouter;