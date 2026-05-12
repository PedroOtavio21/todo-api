import { Router } from "express";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskService } from "../services/TaskService";
import { TaskController } from "../controllers/TaskController";

const taskRouter = Router()

const taskRepository = new TaskRepository()
const taskService = new TaskService(taskRepository)
const taskController = new TaskController(taskService)

taskRouter.get('/tasks', taskController.index)
taskRouter.post('/tasks', taskController.store)
taskRouter.get('/tasks/:id', taskController.show)
taskRouter.put('/tasks/:id', taskController.update)
taskRouter.delete('/tasks/:id', taskController.delete)

export { taskRouter }