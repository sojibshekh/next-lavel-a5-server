import AppError from "../../errorHelpers/appErrors";
import { IAuthProvider, IsActive, Iuser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Document, trusted } from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import TransactionModel, { ITransaction } from "../transaction/transaction.model";
import { Types } from "mongoose";


const createUser = async (playlod: Partial<Iuser> )=>{

    const {  email ,password, ...rest} = playlod;

    const isExist = await User.findOne({email})

    if(isExist){
      throw new AppError(httpStatus.BAD_REQUEST,"User already exists with this email", " ")
    }

     const hassPassrord = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
     

     const authProvider : IAuthProvider={provider:"credential",providerId: email as string}
      const user = await User.create({
        email,
        password: hassPassrord,
        auth: [authProvider],
        ...rest
      });

   


   const wallet = await Wallet.create({
    userId: user._id,
    balance: 50,
    currency: "BDT",
    isLocked: false,
    transactions: [],  
  });

  const registrationTransaction = await TransactionModel.create({
  type: 'registration',
  amount: 50,
  status: 'completed',
  date: new Date(),
  toUserId: user._id,
}) as Document<unknown, {}, ITransaction> & { _id: Types.ObjectId };


   
  await registrationTransaction.save();

  wallet.transactions.push(registrationTransaction._id);
  await wallet.save();





        return user;

}

const updateUser = async (userId: string, playlod: Partial<Iuser>,decodedToken:JwtPayload)=>{

  const ifuserExists = await User.findById(userId);
  if(!ifuserExists){
    throw new AppError(httpStatus.NOT_FOUND, "User not found", " ");
  }

  if(decodedToken.role===Role.USER || decodedToken.role===Role.AGENT){
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this user your not ad", " ");
  }

  if(decodedToken.role===!Role.ADMIN){
   throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this user role", " ");
  }

  if(playlod.isActive || playlod.isDeleted || playlod.isVerified){
    if(decodedToken.role===Role.USER || decodedToken.role===Role.AGENT){
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this user your not active", " ");
  }
  }

  if(playlod.password){
    playlod.password = await bcryptjs.hash(playlod.password, envVars.BCRYPT_SALT_ROUNDS)
  }
  
  const updatedUser = await User.findByIdAndUpdate(userId,playlod,{new: true, runValidators:true})

  return updatedUser;

}

const getUser = async ()=>{
  const users = await User.find({});
  const totalUser = await User.countDocuments({});
  return {
    data: users,
    meta: {
      total: totalUser
    }
  }
}


 export const UserServices = {
    createUser,
    getUser,
    updateUser
}