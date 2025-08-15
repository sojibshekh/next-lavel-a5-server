import { NextFunction, Request, Response } from "express"
import HttpStatus from 'http-status-codes';

const notFount = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
     
    })
}


export default notFount;