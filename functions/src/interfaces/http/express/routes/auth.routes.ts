import { Router } from "express";
import { refreshTokenController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/refresh', refreshTokenController);

export default authRouter;