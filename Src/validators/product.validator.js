import { z } from "zod";

export const sizeSchema = z.object({
  size: z.number().min(1),
  stock: z.number().min(0),
  sku: z.string().min(1)
});

export const variantSchema = z.object({
  metal: z.string().min(1, "Metal is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  sizes: z.array(sizeSchema).min(1, "Variant must contain at least one size")
});

export const productSchema = z.object({
  category: z
    .string()
    .min(1, { message: "Please select a category." }),

  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),

  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),

  isActive: z.boolean().optional()
});