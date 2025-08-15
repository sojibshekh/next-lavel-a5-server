import dotenv from 'dotenv';

dotenv.config();

interface Envconfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    BCRYPT_SALT_ROUNDS: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): Envconfig => {

    const requiredEnvVars: string[] = ['PORT', 'DB_URL', 'NODE_ENV','JWT_ACCESS_SECRET','JWT_ACCESS_EXPIRES', 
        'BCRYPT_SALT_ROUNDS', 'ADMIN_EMAIL', 'ADMIN_PASSWORD','JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRES'];

    requiredEnvVars.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
    });

return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
}

}
export const envVars = loadEnvVariables();