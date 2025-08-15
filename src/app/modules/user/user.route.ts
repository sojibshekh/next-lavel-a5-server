import { NextFunction, Request, Response, Router } from "express";
import { User } from "./user.model";
import { userControllers } from "./user.controller";
import {z, ZodObject, ZodRawShape} from "zod";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middelwares/validatRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appErrors";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middelwares/checkAuth";


const router = Router();




router.post('/register', validateRequest(createUserZodSchema), userControllers.CreateUser);
router.get("/all-user", checkAuth(Role.ADMIN) ,userControllers.getAllUsers);
router.patch("/:id", checkAuth(...Object.values(Role)), userControllers.updateUser);

export const userRoutes = router;