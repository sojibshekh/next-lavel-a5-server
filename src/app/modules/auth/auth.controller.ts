import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsunc"

import htttpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendRespons"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appErrors"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"

const credentialsLogin = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
   
            
    const loginInfo = await AuthServices.credentialsLogin(req.body)
   
    

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false, 
       
    // })

    setAuthCookie(res, loginInfo)
  
        sendResponse(res,{
            statusCode: htttpstatus.OK,
            success: true,
            message: 'New  Access token repliy  successfully',
            data: loginInfo
        })
})

const getNewAcessToken = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
   
     const refreshToken = req.cookies.refreshToken;    
        if(!refreshToken){
            return next(new AppError(htttpstatus.BAD_REQUEST, "Please login to get access token", " "))
        } 
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    res.cookie("accessToken", tokenInfo.accessToken, {
       httpOnly: true,
       secure: false,
    })

  
        sendResponse(res,{
            statusCode: htttpstatus.OK,
            success: true,
            message: 'User Login successfully',
            data: tokenInfo
        })
})


const logOut = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
     
    res.clearCookie("accessToken",{
        httpOnly: true,
        secure: false, 
        sameSite: "lax"
    });
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: false, 
        sameSite: "lax"
    });
  
        sendResponse(res,{
            statusCode: htttpstatus.OK,
            success: true,
            message: 'User LogOut successfully',
            data: null
        })
})


const resetPassword = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
     
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

       await AuthServices.resetPasswordUP(oldPassword, newPassword, decodedToken as JwtPayload);
  
        sendResponse(res,{
            statusCode: htttpstatus.OK,
            success: true,
            message: 'Password Change  successfully',
            data: null
        })
})


const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
   
    const { user } = await AuthServices.getUserinfo(userId);

    sendResponse(res, {
        statusCode: htttpstatus.OK,
        success: true,
        message: "Current user info",
        data: user
    });
});


 

 export const AuthControllers ={
    credentialsLogin,
    getNewAcessToken,
    logOut,
    resetPassword,
    getUserInfo
}