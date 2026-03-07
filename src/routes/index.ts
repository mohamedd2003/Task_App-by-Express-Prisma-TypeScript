import express, { type Router } from "express";
import tasksRouter from "./tasks/tasks.router.ts";
import userRouter from "./users/users.router.ts";

const rootRouter: Router = express.Router();

rootRouter.get("/", (req, res) => {
    res.send("Hello From Root Router");
});
rootRouter.use("/tasks", tasksRouter);
rootRouter.use("/users", userRouter);

export default rootRouter;