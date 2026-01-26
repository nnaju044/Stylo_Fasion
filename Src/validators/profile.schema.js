import { z } from "zod";

export const updateBasicSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const updatePhoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number")
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

export const updateAllProfileSchema = z
  .object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    phone: z.string().optional(),

    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(data => {
    const passwords = [
      data.currentPassword,
      data.newPassword,
      data.confirmPassword
    ];

    const anyFilled = passwords.some(Boolean);
    const allFilled = passwords.every(Boolean);

    return !anyFilled || allFilled;
  }, {
    message: "All password fields are required",
    path: ["currentPassword"]
  })
  .refine(data => {
    if (data.newPassword && data.confirmPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

