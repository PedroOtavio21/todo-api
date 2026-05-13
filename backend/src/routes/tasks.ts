import { Router } from "express";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskService } from "../services/TaskService";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from '../middlewares/auth-middleware';

const taskRouter = Router()

const taskRepository = new TaskRepository()
const taskService = new TaskService(taskRepository)
const taskController = new TaskController(taskService)

taskRouter.get('/tasks', authMiddleware, taskController.index)
taskRouter.post('/tasks', authMiddleware, taskController.store)
taskRouter.get('/tasks/:id', authMiddleware, taskController.show)
taskRouter.put('/tasks/:id', authMiddleware, taskController.update)
taskRouter.delete('/tasks/:id', authMiddleware, taskController.delete)

export { taskRouter }