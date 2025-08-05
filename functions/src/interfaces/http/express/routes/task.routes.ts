import { Router } from "express";
import { 
    createTaskController, 
    getTasksByUserController,
    updateTaskController,
    deleteTaskController,
    completeTaskController
} from "../controllers/task.controller";
import { authenticateToken } from "../../../../infrastructure/middleware/auth.middleware"

const taskRouter = Router();
taskRouter.post("/", authenticateToken, createTaskController);
taskRouter.get("/:userId", authenticateToken, getTasksByUserController);
taskRouter.put("/:taskId", authenticateToken, updateTaskController);
taskRouter.delete("/:taskId", authenticateToken, deleteTaskController);
taskRouter.post("/:taskId/complete", authenticateToken, completeTaskController);

export default taskRouter;
