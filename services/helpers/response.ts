/**
 * Shared response helpers for services
 * 
 * Cấu trúc API response - có 2 dạng:
 * 
 * Dạng 1 (Books, Categories, Promotions):
 * - axios response = { data: { success: true, data: { meta, result } } }
 * - response.data = { success: true, data: {...} }
 * - response.data.data = { meta, result }
 * 
 * Dạng 2 (Users, Orders):
 * - axios response = { data: { success: true, data: [...] } }
 * - response.data = { success: true, data: [...] }
 * - response.data.data = [...] (trùng lặp!)
 */

// Helper nhỏ: kiểm tra object
const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

// Helper nhỏ: kiểm tra có property 'data'
const hasDataProperty = (value: unknown): value is { data: unknown } =>
  isObject(value) && 'data' in value;

/**
 * Lấy data từ response - tự động phát hiện cấu trúc
 * @param response - Axios response object
 * @returns Data bên trong hoặc null
 */
export function getResponseData<T>(response: { data?: unknown }): T | null {
  if (!hasDataProperty(response)) {
    return null;
  }

  const successData = response.data;
  
  // Kiểm tra có nested data không (Dạng 1: Books)
  // successData = { success: true, data: { meta, result } }
  if (hasDataProperty(successData)) {
    return successData.data as T;
  }

  // Không có nested data (Dạng 2: Users, Orders)
  // successData = { success: true, data: [...] }
  return successData as T;
}

/**
 * Lấy data từ response với fallback
 */
export function getResponseDataOr<T>(response: { data?: unknown }, fallback: T): T {
  const data = getResponseData<T>(response);
  return data ?? fallback;
}

/**
 * Lấy array từ response - an toàn cho cả 2 dạng
 * @returns Array data
 */
export function getArrayData<T>(response: { data?: unknown }): T[] {
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
  response: { data?: unknown }
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
