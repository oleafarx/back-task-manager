import { Router } from "express";
import { createTaskController } from "../controllers/task.controller";

const taskRouter = Router();
taskRouter.post("/", createTaskController);
export default taskRouter;