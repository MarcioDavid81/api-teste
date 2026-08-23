import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  userSchema,
} from "../schemas/user.js";
import { errorSchema, messageSchema } from "../schemas/common.js";

const SALT_ROUNDS = 10;

export async function userRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/users",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Cadastrar um novo usuário",
        body: createUserSchema,
        response: {
          201: userSchema,
          409: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.status(409).send({ message: "E-mail já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return reply.status(201).send(user);
    }
  );

  server.get(
    "/users",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Listar usuários",
        response: {
          200: z.array(userSchema),
        },
      },
    },
    async () => {
      return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    }
  );

  server.get(
    "/users/:id",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Buscar usuário por id",
        params: userParamsSchema,
        response: {
          200: userSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
      }

      return user;
    }
  );

  server.put(
    "/users/:id",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        params: userParamsSchema,
        body: updateUserSchema,
        response: {
          200: userSchema,
          404: errorSchema,
          409: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, email, password } = request.body;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
      }

      if (email && email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return reply.status(409).send({ message: "E-mail já cadastrado" });
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          password: password ? await bcrypt.hash(password, SALT_ROUNDS) : undefined,
        },
      });

      return updated;
    }
  );

  server.delete(
    "/users/:id",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Remover usuário",
        params: userParamsSchema,
        response: {
          200: messageSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
      }

      await prisma.user.delete({ where: { id } });

      return { message: "Usuário removido com sucesso" };
    }
  );
}
