import { http } from "@/utils/http";
import {
  getArrayData,
  getResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";
import type { BannerRequest } from "@/types/request/banner.request";
import type { Banner } from "@/types/response/banner.response";

function extractUrlFromResponse(
  response: ApiResponseEnvelope<{ url: string }>,
): string {
  const data = getResponseData<{ url: string }>(response);
  return data?.url ?? "";
}

export const bannerService = {
  async getAllBanners(): Promise<Banner[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Banner[]>>("banners");
      return getArrayData<Banner>(response);
    } catch {
      return [];
    }
  },

  async getBannerById(bannerId: number | string): Promise<Banner> {
    const response = await http.get<ApiResponseEnvelope<Banner>>(
      `banners/${bannerId}`,
    );
    const data = getResponseData<Banner>(response);
    if (!data) throw new Error("Banner not found");
    return data;
  },

  async createBanner(payload: BannerRequest): Promise<Banner> {
    const response = await http.post<ApiResponseEnvelope<Banner>>(
      "banners",
      payload,
    );
    const data = getResponseData<Banner>(response);
    if (!data) throw new Error("Create banner response is missing data");
    return data;
  },

  async updateBanner(
    bannerId: number | string,
    payload: BannerRequest,
  ): Promise<Banner> {
    const response = await http.put<ApiResponseEnvelope<Banner>>(
      `banners/${bannerId}`,
      payload,
    );
    const data = getResponseData<Banner>(response);
    if (!data) throw new Error("Update banner response is missing data");
    return data;
  },

  async deleteBanner(bannerId: number | string): Promise<void> {
    await http.del<ApiResponseEnvelope<null>>(`banners/${bannerId}`);
  },

  async uploadBannerImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.post<ApiResponseEnvelope<{ url: string }>>(
      "cloudinary/upload/banners",
      formData,
    );

    const url = extractUrlFromResponse(response);
    if (!url) throw new Error("Upload failed");
    return url;
  },
};
