import express from 'express';
import cors from 'cors';
import taskRouter from './interfaces/http/express/routes/task.routes';
import userRouter from './interfaces/http/express/routes/user.routes';
import authRouter from './interfaces/http/express/routes/auth.routes';
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/token', authRouter);
app.use('/tasks', taskRouter);
app.use('/users', userRouter);

export default app;
