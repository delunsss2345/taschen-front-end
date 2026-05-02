import { z } from "zod";

const PHONE_REGEX = /^0\d{9}$/;

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be between 6 and 100 characters")
      .max(100, "Password must be between 6 and 100 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Gender is required",
    }),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(PHONE_REGEX, "Phone number must be 10 digits starting with 0"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password do not match",
    path: ["confirmPassword"],
  });
