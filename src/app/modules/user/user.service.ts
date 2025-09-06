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

    const {  email ,password, role: userRole, ...rest} = playlod;

    const isExist = await User.findOne({email})

    if(isExist){
      throw new AppError(httpStatus.BAD_REQUEST,"User already exists with this email", " ")
    }

     const hassPassrord = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));
     

     const authProvider : IAuthProvider={provider:"credential",providerId: email as string}
      const user = await User.create({
        email,
        password: hassPassrord,
        role:userRole  as Role,
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

const updateUser = async (
  userId: string, 
  payload: Partial<Iuser>, 
  decodedToken: JwtPayload
) => {
  // Check if user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found", " ");
  }

  // Only admin can update users
  if (decodedToken.role !== Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this user", " ");
  }


    // Ensure payload is defined
  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, "No data provided for update", " ");
  }

  // Hash password if present
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    payload,
    { new: true, runValidators: true }
  );

  return updatedUser;
};


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




// User service function
const updateOwnProfile = async (userId: string, payload: Partial<Iuser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found", " ");
  }

  // password থাকলে hash করে দিন
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};







 export const UserServices = {
    createUser,
    getUser,
    updateUser,
    updateOwnProfile
 
}