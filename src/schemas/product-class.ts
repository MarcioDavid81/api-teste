import { z } from "zod";

export const productClassSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProductClassSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
});

export const updateProductClassSchema = createProductClassSchema.partial();

export const productClassParamsSchema = z.object({
  id: z.string().uuid("Id inválido"),
});

export type CreateProductClassInput = z.infer<typeof createProductClassSchema>;
export type UpdateProductClassInput = z.infer<typeof updateProductClassSchema>;
