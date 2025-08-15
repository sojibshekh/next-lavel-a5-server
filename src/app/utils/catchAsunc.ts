import { NextFunction, Request, Response } from "express";

type AysncHeandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
 export const catchAsync = (fn:AysncHeandler) => (req:Request, res:Response,next:NextFunction ) => {
    Promise.resolve(fn(req, res, next)).catch((err:any)=>{
        console.log(err)
        next(err);
    })
}
