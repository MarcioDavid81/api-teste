import { z } from "zod";

export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  address: z.string().min(5, "Endereço deve ter ao menos 5 caracteres"),
  phone: z.string().min(8, "Telefone inválido"),
});

export const updateClientSchema = createClientSchema.partial();

export const clientParamsSchema = z.object({
  id: z.string().uuid("Id inválido"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
