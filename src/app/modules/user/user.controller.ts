import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import htttpstatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsunc";
import { sendResponse } from "../../utils/sendRespons";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appErrors";



// const createUserFunction = (req:Request, res:Response)=>{
//     const user = await UserServices.createUser(req.body)
      
//        res.status(htttpstatus.CREATED).json({
//             message: 'user create success',
//             user
//         })
// }



const CreateUser = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body)
      
    //    res.status(htttpstatus.CREATED).json({
    //         message: 'user create success',
    //         user
    //     })

        sendResponse(res,{
            statusCode: htttpstatus.CREATED,
            success: true,
            message: 'User created successfully',
            data: user
        })
})

const updateUser = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.params.id;

    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;
    const playlod = req.body;
    if(!verifiedToken){
        return next(new AppError(htttpstatus.UNAUTHORIZED, "User not authorized", " "));
    }
    const user = await UserServices.updateUser(userId, playlod, verifiedToken)
      
        sendResponse(res,{
            statusCode: htttpstatus.CREATED,
            success: true,
            message: 'User updated successfully',
            data: user
        })
})



const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

     const result = await UserServices.getUser();
        

     sendResponse(res,{
            statusCode: htttpstatus.CREATED,
            success: true,
            message: 'All User get successfully',
            data: result.data,
            meta: result.meta
        })
    
}) 


export const userControllers = {
    CreateUser,
    getAllUsers,
    updateUser
}