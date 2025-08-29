import { Response } from "express";
import { envVars } from "../config/env";

export interface AuthToken{
    accessToken?: string;
    refreshToken?: string;
}

 export const setAuthCookie = (res:Response, tokenInfo: AuthToken)=>{

      const isProduction = envVars.NODE_ENV === "production";

    if(tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
       httpOnly: true,
       secure: isProduction, // Set to true in production
       sameSite: isProduction ? "none" : "lax",
       path: "/",
    })
    }
    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        secure: isProduction, // Set to true in production
        sameSite: isProduction ? "none" : "lax",
        path: "/",
       
    })
    }
}