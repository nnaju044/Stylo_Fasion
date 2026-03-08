import { z } from "zod";

export const sizeSchema = z.object({
  size: z.number().min(1),
  stock: z.number().min(0),
  sku: z.string().min(1)
});

export const variantSchema = z.object({
  metal: z.string().min(1),
  price: z.number().min(1),
  sizes: z.array(sizeSchema).min(1)
});

export const productSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(5),
  isActive: z.boolean().optional()
});