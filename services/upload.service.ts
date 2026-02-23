import { http } from "@/utils/http";
import { getResponseData } from "./helpers/response";

// Helper nhỏ: tạo FormData cho upload
function createUploadFormData(file: File, folder: string): FormData {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  return formData;
}

// Helper nhỏ: extract URL từ response upload
function extractUrlFromResponse(response: { data?: unknown }): string {
  const data = getResponseData<{ url: string }>(response);
  return data?.url ?? "";
}

export const uploadService = {
  async uploadImage(file: File, folder: string = "books"): Promise<string> {
    const formData = createUploadFormData(file, folder);
    
    try {
      const response = await http.post(`/api/cloudinary/upload/${folder}`, formData);
      return extractUrlFromResponse(response);
    } catch {
      return "";
    }
  },
};
