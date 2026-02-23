
export type ApiResponseEnvelope<T> = {
  data?: T | { data?: T };
};

// Helper nhỏ: kiểm tra object
const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

// Helper nhỏ: kiểm tra có property 'data'
const hasDataProperty = (value: unknown): value is { data: unknown } =>
  isObject(value) && "data" in value;

/**
 * Lấy data từ response - tự động phát hiện cấu trúc
 * @param response - Axios response object
 * @returns Data bên trong hoặc null
 */
export function getResponseData<T>(
  response: ApiResponseEnvelope<T> | null | undefined,
): T | null {
  if (!response || !hasDataProperty(response)) {
    return null;
  }

  const successData = response.data;
  if (successData === undefined || successData === null) {
    return null;
  }

  // Kiểm tra có nested data không (Dạng 1: Books)
  // successData = { success: true, data: { meta, result } }
  if (hasDataProperty(successData)) {
    return (successData.data as T | null | undefined) ?? null;
  }

  // Không có nested data (Dạng 2: Users, Orders)
  // successData = { success: true, data: [...] }
  return successData as T;
}

/**
 * Lấy data từ response với fallback
 */
export function getResponseDataOr<T>(
  response: ApiResponseEnvelope<T> | null | undefined,
  fallback: T,
): T {
  const data = getResponseData<T>(response);
  return data ?? fallback;
}

/**
 * Lấy array từ response - an toàn cho cả 2 dạng
 * @returns Array data
 */
export function getArrayData<T>(
  response: ApiResponseEnvelope<unknown> | null | undefined,
): T[] {
  const successData = getResponseData<unknown>(response);

  if (!successData) {
    return [];
  }

  // Nếu đã là array
  if (Array.isArray(successData)) {
    return successData as T[];
  }

  // Nếu là object có property 'data' chứa array
  if (isObject(successData) && 'data' in successData) {
    const innerData = successData.data;
    if (Array.isArray(innerData)) {
      return innerData as T[];
    }
  }

  // Nếu là object có property 'result' chứa array (phân trang)
  if (isObject(successData) && 'result' in successData) {
    const result = successData.result;
    if (Array.isArray(result)) {
      return result as T[];
    }
  }

  return [];
}

/**
 * Lấy list data từ response phân trang
 * @returns Object chứa data array và meta
 */
export function getListData<T, M = unknown>(
  response: ApiResponseEnvelope<unknown> | null | undefined,
): { data: T[]; meta: M | undefined } {
  const arrayData = getArrayData<T>(response);

  // Thử lấy meta nếu có
  const successData = getResponseData<unknown>(response);

  let meta: M | undefined;
  if (isObject(successData) && 'meta' in successData) {
    meta = successData.meta as M;
  }

  return { data: arrayData, meta };
}

/**
 * Lấy data bắt buộc từ response
 * @throws Error khi response không có data hợp lệ
 */
export function requireResponseData<T>(
  response: ApiResponseEnvelope<T> | null | undefined,
  errorMessage = "Invalid API response",
): T {
  const data = getResponseData<T>(response);

  if (data === null) {
    throw new Error(errorMessage);
  }

  return data;
}
