import { z } from "zod";

export const productSchema = z.object({
  category: z.string().min(1, "Category required"),
  name: z.string().min(2, "Product name required"),
  description: z.string().min(5, "Description required"),
  isActive: z.boolean()
});

export const variantSchema = z.object({
  metal: z.string().min(1),
  size: z.number().positive(),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
  sku: z.string().min(3),
  images: z.array(z.any()).min(3, "Minimum 3 images required")
});



