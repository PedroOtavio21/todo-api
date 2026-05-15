import { HttpError } from "../errors/HttpError";
import { Task, TaskStatus } from "../models/TaskModel";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
    constructor(private repository: TaskRepository){}
    async getAll(userId: number, status?: TaskStatus) {
        return this.repository.findAll(userId, status)
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
        await this.getById(userId, id)
        return this.repository.update(id, userId,task)
    }
    async delete(userId: number, id: number){
        await this.getById(userId, id)
        return this.repository.delete(id, userId)
    }
}