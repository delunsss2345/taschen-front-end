export interface Banner {
  id: number;
  name: string;
  imageUrl: string;
  subtitle: string;
  tag: string;
}

export interface BannerApiResponse {
  error: string | null;
  message: string;
  statusCode: number;
  data: Banner;
}

export interface BannersApiResponse {
  error: string | null;
  message: string;
  statusCode: number;
  data: Banner[];
}

export interface UploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}
