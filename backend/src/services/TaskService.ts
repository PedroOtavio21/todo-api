import { HttpError } from "../errors/HttpError";
import { Task } from "../models/TaskModel";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
    constructor(private repository: TaskRepository){}
    async getAll(userId: number){
        return this.repository.findAll(userId)
    }
    async getById(userId:number, id: number){
        const task = await this.repository.findById(id, userId)
        if (!task) throw new HttpError(404, "Task not found!")
        return task
    }
    async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">){
        if (task.status === "DONE") throw new HttpError(400, "Cannot create a task already done!")
        return this.repository.create(task)
    }
    async update(userId: number, id: number, task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) {
        await this.getById(id, userId)
        return this.repository.update(id, userId,task)
    }
    async delete(userId: number, id: number){
        await this.getById(userId, id)
        return this.repository.delete(id, userId)
    }
}