import { z } from "zod";

// Email regex
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Password regex: at least one lowercase, uppercase, number, special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "first_name cannot be an empty field" }),
  lastName: z
    .string()
    .min(1, { message: "last_name cannot be an empty field" }),
  email: z
    .string()
    .min(1, { message: "email cannot be an empty field" })
    .regex(emailRegex, { message: "Incorrect email format" }),
  phoneNumber: z
    .string()
    .min(1, { message: "phone_number cannot be an empty field" }),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters long." })
    .regex(passwordRegex, {
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email cannot be an empty field" })
    .regex(emailRegex, { message: "Incorrect email format" }),
  password: z.string().min(1, { message: "password cannot be an empty field" }),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, { message: "old_password cannot be an empty field" }),
  newPassword: registerSchema.shape.password,
});

// Infer TypeScript types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordInput = z.infer<typeof changePasswordSchema>;
