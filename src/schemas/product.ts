import { z } from "zod";
import { productClassSchema } from "./product-class.js";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  productClassId: z.string().uuid("Id inválido"),
  productClass: productClassSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  productClassId: z.string().uuid("Id inválido"),
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().uuid("Id inválido"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
