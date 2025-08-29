import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appErrors";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

 export const checkAuth= (...authRoles: string[])=>  async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError(401, "Access token is missing", " ");
        }
        const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload;

        const isUserExist = await User.findOne({email: verifiedToken.email});
    
        if(!isUserExist){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  exists with this email", " ")
        }
        if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  is block", " ")
        }

        if(isUserExist.isDeleted){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  is deleted", " ")
        }


        if(!authRoles.includes(verifiedToken.role)){
             throw new AppError(401, "you are not permited to use this route", " ");
        }
        req.user = verifiedToken;
        next();
    } catch (error) {
        next(error);
    }
}