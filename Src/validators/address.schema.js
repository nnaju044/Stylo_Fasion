import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  addressLine: z.string().min(5),
  pincode: z.string().length(6),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().optional(),
});
