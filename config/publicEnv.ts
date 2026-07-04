// Client-safe environment. ONLY values exposed to the browser (NEXT_PUBLIC_* / relative defaults).
// NEVER import server secrets here (BACKEND_API_URL, auth/google secrets) — those live in
// config/envConfig.ts which is server-only. Keeping them apart stops secrets/backend URL from
// being inlined into the client bundle.
export const publicEnv = {
  // The browser calls our own Next BFF (app/api/**). Default is the relative "/api" so the
  // client never talks to the Spring backend directly — this preserves the BFF boundary.
  baseApi: process.env.NEXT_PUBLIC_BASE_API || "/api",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export type PublicEnv = typeof publicEnv;
