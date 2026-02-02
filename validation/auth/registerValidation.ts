import { z } from "zod";

export const RegisterSchema = z.object({
    firstName: z.string().min(1, "Tên không được để trống"),
    lastName: z.string().min(1, "Họ không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});
