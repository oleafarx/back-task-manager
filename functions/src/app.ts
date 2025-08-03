import express from 'express';
import taskRouter from './interfaces/http/express/routes/task.routes';
import cors from 'cors';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/tasks', taskRouter);

export default app;
