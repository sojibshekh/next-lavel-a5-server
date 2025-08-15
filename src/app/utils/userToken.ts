import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appErrors";
import { IsActive, Iuser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { genaretToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes";

 export const createUserTokens=(user: Partial<Iuser>)=>{
    const jwtPayload ={
                id: user._id,
                email: user.email,
                role: user.role
                
            }
            const accessToken = genaretToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
            const refreshToken = genaretToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);
            // const accessToken = jwt.sign(jwtPayload, "secret",{
            //     expiresIn: "1d"
            // })

            return{
                accessToken,
                refreshToken
            }
}


export const createNewAccessTokenWithRefreshToken= async (refreshToken: string)=>{
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
    
   
    const isUserExist = await User.findOne({email: verifiedRefreshToken.email});
    
        if(!isUserExist){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  exists with this email", " ")
        }
        if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  is block", " ")
        }

        if(isUserExist.isDeleted){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  is deleted", " ")
        }

       
            const jwtPayload ={
            id: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role
            
        }
        const accessToken = genaretToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)


        return{
            accessToken,
        }
}