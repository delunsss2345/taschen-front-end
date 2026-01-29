import { config } from 'dotenv';
config();
export const envConfig = {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,

}