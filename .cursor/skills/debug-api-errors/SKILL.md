---
name: debug-api-errors
description: Debug API errors in the Bookstore frontend. Use when API calls fail (4xx/5xx), users report "bắt đăng nhập lại" (403), requests return 400, or any network/HTTP error in the Next.js app.
---

# Debug API Errors — Bookstore Frontend

## Architecture Overview

```
Browser → Next.js API Route (localhost:3000/api/*) → Backend API (api.phamtra.dev/api/*)
```

**Two HTTP layers:**

1. **Client (browser)**: `utils/http.ts` — uses `axios`, reads token from Zustand store (`auth.store.ts`), auto-refreshes token on 401.
2. **Server (Next.js routes)**: `lib/api/fetchHandler.ts` — uses native `fetch`, reads token from request `Authorization` header via `getAuthorizationHeader()`.

**Key files:**

| File | Role |
|------|------|
| `utils/http.ts` | Client-side HTTP (browser → Next.js) |
| `lib/api/fetchHandler.ts` | Server-side HTTP (Next.js → backend) |
| `app/api/_utils/route-utils.ts` | `handleRouteError()` — transforms backend errors into user-friendly messages |
| `config/env/config.ts` | Env config, maps `.env` vars |
| `.env` | `NEXT_PUBLIC_BASE_API` (client target) + `BACKEND_API_URL` (server target) |

## Debugging Checklist

### Step 1: Where does the error appear?

| Location | Meaning | Next step |
|----------|---------|-----------|
| **Browser console** (`[http._send]`) | Error from `utils/http.ts` (client layer) | Go to Step 2a |
| **Terminal server** (`[Some API Error]`) | Error from `route-utils.ts` (server layer) | Go to Step 2b |

### Step 2a: Client-side error (browser console)

Look at the error object:
- **`status: 401/403`** → Token not sent or invalid. Check:
  - Is user actually logged in? (`useAuthStore.getState().accessToken`)
  - Does the URL pass `isPublicApi()`? (Check `utils/isPublicPath.ts`)
  - For 403: token was sent but backend rejected it. Add debug log in `axiosInstance.interceptors.request.use` to log the token.
- **`status: 400`** → Backend returned 400. Check `response.data` field in the error.
- **`status: 500`** → Backend crashed. Check backend logs.
- **`ERR_BAD_REQUEST` but no `response` field** → Next.js route returned 400 with empty/invalid body. Check terminal server logs.

### Step 2b: Server-side error (terminal / `console.error`)

The `handleRouteError` function logs full error with `JSON.stringify(error, null, 2)`. Key things to check:

- **`error instanceof HttpError`** → Error was thrown by `fetchHandler.ts`. Shows `status`, `message`, `data`.
- **`NOT HttpError!`** → Unknown error type. Look at `error?.constructor?.name`.
- **`api.del is not a function`** → Using `api.del` instead of `api.delete`. `fetchHandler.ts` only exports `delete`, not `del`.

### Step 3: Trace the Authorization header

**Client → Next.js** (browser console, check `config.headers.Authorization`):
```javascript
// In utils/http.ts axiosInstance interceptors, add temporarily:
console.log("Sending Authorization:", config.headers.Authorization);
```

**Next.js → Backend** (terminal server, check `route-utils.ts`):
```javascript
// In the route handler, add temporarily:
console.log("Headers sent to backend:", JSON.stringify(headers, null, 2));
```

### Step 4: Common pitfalls

**1. Wrong argument order for `api.delete`**

`fetchHandler.ts` signature:
```typescript
delete<T>(path: string, body?: unknown, opt?: ApiOptions)
```

Correct usage (with Authorization):
```typescript
// ✅ body=undefined, options={headers}
await api.delete(`banners/${id}`, undefined, { headers });

// ❌ headers passed as body!
await api.delete(`banners/${id}`, { headers });
// The {headers} object goes into body, and options={} → no Authorization sent → 403!
```

**2. `api.del` vs `api.delete`**

`fetchHandler.ts` only exports `delete`, not `del`. Using `api.del()` throws `api.del is not a function`.

**3. `validateStatus` not covering 204**

If backend returns 204 No Content, `axios` throws by default. Fix in `utils/http.ts`:
```typescript
axios.create({
  validateStatus: (status) => status >= 200 && status < 300 || status === 204,
});
```

**4. Empty backend response body**

If `response.data` is empty in browser console (no `message`, no `response` field), the Next.js route returned a 4xx with a non-JSON or empty body. Check terminal server for `console.error` output from `handleRouteError`.

### Step 5: Backend URL mismatch

- Client uses `NEXT_PUBLIC_BASE_API` = `http://localhost:3000/api/`
- Server uses `BACKEND_API_URL` = `https://api.phamtra.dev/api/`

Both must be consistent. If backend URL changes, update `.env`.

### Step 6: Check backend logs

The backend (at `api.phamtra.dev`) has its own logs. If Next.js routes forward requests correctly but backend still returns unexpected errors, check backend-side logs for the actual rejection reason.

## Reference: Error Flow Diagram

```
Browser clicks delete
  → utils/http.ts (axios) → localhost:3000/api/banners/3
    → app/api/banners/[id]/route.ts DELETE
      → getAuthorizationHeader(request) extracts Authorization header
      → api.delete("banners/3", undefined, { headers }) [fetchHandler]
        → fetch to https://api.phamtra.dev/api/banners/3
          → Backend validates token → SUCCESS or 403/401/500
      → If error: handleRouteError() → ResponseApi.error()
    → Returns Response to browser
  → utils/http.ts catches response
    → If 2xx: return data
    → If 401: refresh token → retry
    → If 4xx/5xx: throw AxiosError → show toast
```
