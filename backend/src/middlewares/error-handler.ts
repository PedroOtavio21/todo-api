import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message })
    } else if (err instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: err.flatten().fieldErrors })
    } else if (err instanceof Error) {
        res.status(500).json({ message: err.message })
    } else {
        res.status(500).json({ message: "Internal server error" })
    }
}