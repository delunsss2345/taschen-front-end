
export const envConfig = {
  backendApiUrl: process.env.BACKEND_API_URL || 'https://api.phamtra.dev',
  
  publicBaseApi: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000',
  
  // NextAuth
  nextAuth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || 'change-this-secret',
    debug: process.env.NEXTAUTH_DEBUG === 'true',
  },
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Endpoints
  getApiUrl: (path: string) => {
    const base = process.env.BACKEND_API_URL || 'https://api.phamtra.dev';
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  },
  
  getPublicApiUrl: (path: string) => {
    const base = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000';
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  },
} as const;

export type EnvConfig = typeof envConfig;
