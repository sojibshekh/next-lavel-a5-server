import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appErrors";

export const globalErrorHandler=(err:any, req: Request, res: Response, next: NextFunction) =>{
  
    let statusCode = 500;
    let message = `Something went wrong: ${err.message} global error handler`

    if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500
        message = err.message
    }


    res.status(statusCode).json({
        success:false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })

}