import { z } from "zod";

// Password complexity validator
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage = "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)";

// Phone number validator - extracts digits only
const phoneRegex = /^\d{10}$/;

export const signupSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z.string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters"),
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  phone: z.string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits (no spaces or special characters)"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, passwordMessage),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z.string()
    .min(1, "Password is required")
});

export const verifyOtpSchema = z.object({
  otp: z.string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

// Admin login schema - for consistency
export const adminLoginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z.string()
    .min(1, "Password is required")
});
