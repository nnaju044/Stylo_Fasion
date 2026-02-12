import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2,"Full name must be at least 2 characters"),
  phone: z.string().min(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  addressLine: z.string().min(5, "Address must be at least 5 characters"),
  pincode: z.string().length(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  city: z.string().min(2,"City must be at least 2 characters"),
  state: z.string().min(2,"State must be at least 2 characters"),
  country: z.string().optional(),
});
