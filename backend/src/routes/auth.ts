import { Router } from 'express'
import { UserRepository } from '../repositories/UserRepository'
import { UserService } from '../services/UserService'
import { UserController } from '../controllers/UserController'

const authRouter = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

authRouter.post('/register', userController.register)
authRouter.post('/login', userController.login)

export { authRouter }