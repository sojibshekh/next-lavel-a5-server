import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, Iuser, Role } from "./user.interface";
import { boolean, object } from "zod";



const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
},{
    versionKey: false,
    _id: false,
})

const UserSchema = new Schema<Iuser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false},
    
    role: {
        type: String, 
        enum: Object.values(Role),
        default: Role.USER,
    },
    phone: {type: String, required: false},
    picture: {type: String, required: false},
    address: {type: String, required: false},
    isDeleted: {type: boolean, default: 'false'},
    isActive: {
        type: String, 
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isVerified: {type: Boolean, default: 'false'},

    auth:[authProviderSchema],
  

        
    },{
    timestamps: true,
    versionKey: false
})


export const User = model<Iuser>("User", UserSchema);