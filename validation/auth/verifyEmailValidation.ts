import { z } from "zod";

export const VerifyEmailSchema = z.object({
    verifyToken: z.string().min(1, "Mã xác thực không được để trống"),
});
