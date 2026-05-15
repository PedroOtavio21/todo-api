import z from "zod";
import { TaskService } from "../services/TaskService";
import { Handler } from "express";
import { AuthRequest } from "../middlewares/auth-middleware";

const StoreSchema = z.object({
    title: z.string().min(1, 'Title is required!'),
    description: z.string().optional(),
    status: z.enum(["PENDING", "DONE"]).default('PENDING'),
})

const UpdateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["PENDING", "DONE"]).optional(),
})

export class TaskController {
    constructor(private service: TaskService){}
    index: Handler = async (req, res, next) => {
        try {
            const { id: userId } = (req as unknown as AuthRequest).user
            const { status } = req.query as { status?: 'PENDING' | 'DONE' }
            const tasks = await this.service.getAll(userId, status)
            res.json(tasks)
        } catch (error) {
            next(error)
        }
    }
    store: Handler = async (req, res, next) => {
        try {
            const { id: userId } = (req as unknown as AuthRequest).user
            const body = StoreSchema.parse(req.body)
            const task = await this.service.create({ ...body, description: body.description ?? null, userId })
            res.status(201).json(task)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const { id: userId } = (req as unknown as AuthRequest).user
            const task = await this.service.getById(userId, Number(req.params.id))
            res.json(task)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const { id: userId } = (req as unknown as AuthRequest).user
            const body = UpdateSchema.parse(req.body)
            const task = await this.service.update(userId, Number(req.params.id), body)
            res.json(task)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const { id: userId } = (req as unknown as AuthRequest).user
            await this.service.delete(userId, Number(req.params.id))
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}