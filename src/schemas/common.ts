import { z } from "zod";

export const messageSchema = z.object({
  message: z.string(),
});

export const errorSchema = z.object({
  message: z.string(),
  issues: z.array(z.any()).optional(),
});
