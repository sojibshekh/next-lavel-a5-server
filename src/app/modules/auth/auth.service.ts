import { IsActive, Iuser } from "../user/user.interface"
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appErrors";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { genaretToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken";
import { string } from "zod";

const credentialsLogin = async(payload : Partial<Iuser> )=>{


    const {email, password} = payload;
    const isExist = await User.findOne({email})
    
        if(!isExist){
          throw new AppError(httpStatus.BAD_REQUEST,"User not  exists with this email", " ")
        }

        const ifPasswordMatch = await bcryptjs.compare(password as string, isExist.password as string);

        if(!ifPasswordMatch){
          throw new AppError(httpStatus.BAD_REQUEST,"Password not match", " ")
        }
          
        // const jwtPayload ={
        //     id: isExist._id,
        //     email: isExist.email,
        //     role: isExist.role
            
        // }
        // const accessToken = genaretToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

        // const refreshToken = genaretToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);


        // const accessToken = jwt.sign(jwtPayload, "secret",{
        //     expiresIn: "1d"
        // })
        
        const userTokens = createUserTokens(isExist);
        
       const {password: pass, ...rest} = isExist.toObject();

        return {
            accessToken: userTokens.accessToken, 
            refreshToken: userTokens.refreshToken,
            user: rest,
        }
    
}



const getNewAccessToken = async(refreshToken: string )=>{
       
    const NewAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

        return {
            accessToken :NewAccessToken ,
        }
    
}

const resetPasswordUP = async(oldPassword: string, newPassword: string , decodedToken: JwtPayload )=>{

    const user = await User.findById(decodedToken.id);

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User not found", " ");
    }
       
     const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
        if(!isOldPasswordMatch){
            throw new AppError(httpStatus.UNAUTHORIZED, "Old password not match", " ");
        }

        user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUNDS));
         
        user!.save();
    
}

 export const AuthServices ={
    credentialsLogin,
    getNewAccessToken,
    resetPasswordUP
}