export interface BaseResponse<T> {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
}
