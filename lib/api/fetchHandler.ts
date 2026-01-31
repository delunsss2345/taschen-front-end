import { envConfig } from "@/config/envConfig";
import "server-only";
const BACKEND_URL = envConfig.BACKEND_API_URL;

export class HttpError<T = unknown> extends Error {
    status: number;
    data?: T;
    constructor(status: number, message: string, data?: T) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.data = data;
    }
}

type Query = Record<string, string | number | boolean | null | undefined>;

type ApiOptions = Omit<RequestInit, "body"> & {
    baseURL?: string;     // default: process.env.API_BASE_URL
    query?: Query;
    body?: unknown;       // body JSON
    timeoutMs?: number;   // default 15s
};

function buildUrl(baseURL: string, path: string, query?: Query) {
    const url = new URL(path, baseURL);
    if (query) {
        for (const [k, v] of Object.entries(query)) {
            if (v) {
                url.searchParams.set(k, String(v));
            }
        }
    }
    return url.toString();
}

async function request<T>(method: string, path: string, opt: ApiOptions = {}): Promise<T> {
    const {
        baseURL = process.env.API_BASE_URL!,
        query,
        body,
        timeoutMs = 15000,
        headers,
        ...init
    } = opt;

    const url = buildUrl(baseURL, path, query);
    const header = new Headers(headers);
    if (body !== undefined) header.set("content-type", "application/json");

    const abortController = new AbortController(); //  khởi tạo controll chặn fetch gọi quá lâu
    const t = setTimeout(() => abortController.abort(), timeoutMs); // tạo timeout mốc quá time out quăng lỗi

    let res: Response;
    try {
        res = await fetch(url, {
            ...init,
            method,
            headers: header,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: abortController.signal,
            cache: init.cache ?? "no-store",
        });
    } finally {
        clearTimeout(t); // xong sớm clear timeout với id
    }

    const contentType = res.headers.get("content-type") || ""; // check có phải json 
    const isJson = contentType.includes("application/json");
    const data: { message?: string, error?: string } = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
        const msg =
            (isJson && data && (data.message || data.error)) ? (data.message || data.error || 'InternalServerError') : `HTTP ${res.status ?? 505}`;
        throw new HttpError(res.status, msg, data);
    }

    return data as T;
}

export const fetchApi = (defaults: Pick<ApiOptions, "baseURL" | "headers"> = {}) => {
    const withDefaults = (opt?: ApiOptions): ApiOptions => ({
        ...opt,
        baseURL: opt?.baseURL ?? defaults.baseURL,
        headers: { ...(defaults.headers as Headers), ...(opt?.headers as Headers) },
    });

    return {
        get<T>(path: string, opt?: ApiOptions) {

            return request<T>("GET", path, withDefaults(opt));
        },
        post<T>(path: string, body?: unknown, opt?: ApiOptions) {
            console.log(path);
            return request<T>("POST", path, withDefaults({ ...opt, body }));
        },
        put<T>(path: string, body?: unknown, opt?: ApiOptions) {
            return request<T>("PUT", path, withDefaults({ ...opt, body }));
        },
        patch<T>(path: string, body?: unknown, opt?: ApiOptions) {
            return request<T>("PATCH", path, withDefaults({ ...opt, body }));
        },
        delete<T>(path: string, opt?: ApiOptions) {
            return request<T>("DELETE", path, withDefaults(opt));
        },
    };
};


export const api = fetchApi({
    baseURL: BACKEND_URL
})