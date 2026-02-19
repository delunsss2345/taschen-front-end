import { config } from 'dotenv';
import { envConfig as defaultEnv } from './env/config';
config();

export const envConfig = {
    // Backend API URL - Server-side
    BACKEND_API_URL: process.env.BACKEND_API_URL || defaultEnv.backendApiUrl,
    
    // Client-side API
    NEXT_PUBLIC_BASE_API: process.env.NEXT_PUBLIC_BASE_API || defaultEnv.publicBaseApi,
    
    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || defaultEnv.google.clientId,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || defaultEnv.google.clientSecret,
    
    // NextAuth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || defaultEnv.nextAuth.url,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || defaultEnv.nextAuth.secret,
    NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG || defaultEnv.nextAuth.debug ? 'true' : 'false',
    
    // Helpers
    isDevelopment: defaultEnv.isDevelopment,
    isProduction: defaultEnv.isProduction,
    getApiUrl: defaultEnv.getApiUrl,
    getPublicApiUrl: defaultEnv.getPublicApiUrl,
};