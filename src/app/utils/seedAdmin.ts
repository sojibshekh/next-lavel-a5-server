import { email, number } from "zod";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
import { IAuthProvider, Iuser, Role } from "../modules/user/user.interface";

export const seedAdmin = async () => {
    try {
        const isAdminExists = await User.findOne({ email: envVars.ADMIN_EMAIL});
        if (isAdminExists) {
            console.log("Admin already exists");
            return;
        }
        const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUNDS));
        const authProvider :IAuthProvider={
            provider: "credential",
            providerId: envVars.ADMIN_EMAIL
        }
        const payload: Iuser ={
            name: "Admin",
            role:Role.ADMIN,
            email: envVars.ADMIN_EMAIL,  
            password: hashedPassword,
            isVerified: true,
            auth: [authProvider],
        }

        const admin = await User.create(payload)


        
    } catch (error) {
        console.error("Error seeding admin:", error);   
        
    }
}