
import express, { NextFunction, Request, Response } from 'express';
import { userRoutes } from './app/modules/user/user.route';

import cors from 'cors';
import { router } from './app/routes';
import { any, success } from 'zod';
import { envVars } from './app/config/env';
import { globalErrorHandler } from './app/middelwares/globalErrorHandeller';
import HttpStatus from 'http-status-codes';
import notFount from './app/middelwares/notFound';
import cookieParser from 'cookie-parser';





const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:5173','https://digital-wallte-forntend.vercel.app'],
    credentials: true,

   }))

app.use("/api/v1",router )
app.get("/",(req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to the Digital Wallet  Backend"
    })
})



app.use(globalErrorHandler)
app.use(notFount)


export default app;