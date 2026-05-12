import z from "zod";
import { TaskService } from "../services/TaskService";
import { Handler } from "express";

const StoreSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(["PENDING", "DONE"]),
})

const UpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["PENDING", "DONE"]).optional(),
})

export class TaskController {
    constructor(private service: TaskService){}
    index: Handler = async (req, res, next) => {
        try {
            const tasks = await this.service.getAll()
            res.json(tasks)
        } catch (error) {
            next(error)
        }
    }
    store: Handler = async (req, res, next) => {
        try {
            const body = StoreSchema.parse(req.body)
            const task = await this.service.create(body)
            res.status(201).json(task)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const task = await this.service.getById(Number(req.params.id))
            res.json(task)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const body = UpdateSchema.parse(req.body)
            const task = await this.service.update(Number(req.params.id), body)
            res.json(task)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            await this.service.delete(Number(req.params.id))
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}