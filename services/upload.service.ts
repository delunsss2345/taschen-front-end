import { http } from "@/utils/http";

export const uploadService = {
  async uploadImage(file: File, folder: string = 'books'): Promise<string> {
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await http.post('/api/cloudinary/upload/' + folder, formData) as any;

    // API returns { success: true, data: { url: "..." } }
    const url = response.data?.data?.url || response.data?.url || ''
    return url;
  },
};
