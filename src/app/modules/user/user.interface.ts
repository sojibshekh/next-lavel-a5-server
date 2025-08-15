import { Types } from "mongoose";

export enum Role {
    ADMIN = 'admin',
    USER = 'user',  
    AGENT = 'agent',
}

export interface IAuthProvider{
    provider: "google" | "credential";
    providerId: string;
}
export enum IsActive{
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
}
export interface Iuser{
    _id?: Types.ObjectId;
    name: string;
    email: string;  
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: string
    isVerified?: boolean;   
    role: Role;
    auth: IAuthProvider[];
    transactionId?: Types.ObjectId[];
}