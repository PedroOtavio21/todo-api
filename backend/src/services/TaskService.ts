import { HttpError } from "../errors/HttpError";
import { Task } from "../models/TaskModel";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
    constructor(private repository: TaskRepository){}
    async getAll(){
        return this.repository.findAll()
    }
    async getById(id: number){
        const task = await this.repository.findById(id)
        if (!task) throw new HttpError(404, "Task not found!")
        return task
    }
    async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">){
        if (task.status === "DONE") throw new HttpError(400, "Cannot create a task already done!")
        return this.repository.create(task)
    }
    async update(id: number, task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) {
        await this.getById(id)
        return this.repository.update(id, task)
    }
    async delete(id: number){
        await this.getById(id)
        return this.repository.delete(id)
    }
}