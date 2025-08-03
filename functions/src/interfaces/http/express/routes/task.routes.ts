import { Router } from "express";
import { 
    createTaskController, 
    getTasksByUserController,
    updateTaskController,
    deleteTaskController,
    completeTaskController
} from "../controllers/task.controller";

const taskRouter = Router();
taskRouter.post("/", createTaskController);
taskRouter.get("/:userId", getTasksByUserController);
taskRouter.put("/:taskId", updateTaskController);
taskRouter.delete("/:taskId", deleteTaskController);
taskRouter.post("/:taskId/complete", completeTaskController);

export default taskRouter;
