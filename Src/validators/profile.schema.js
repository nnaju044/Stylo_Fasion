import { z } from "zod";

export const updateBasicSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const updatePhoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Invalid phone"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(6, "Password too short"),
  confirmPassword: z.string().min(6),
}).refine(
  data => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
);
