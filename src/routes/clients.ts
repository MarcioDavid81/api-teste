import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  clientParamsSchema,
  clientSchema,
  createClientSchema,
  updateClientSchema,
} from "../schemas/client.js";
import { errorSchema, messageSchema } from "../schemas/common.js";

export async function clientRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/clients",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Cadastrar um novo cliente",
        body: createClientSchema,
        response: {
          201: clientSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, address, phone } = request.body;

      const client = await prisma.client.create({
        data: { name, address, phone },
      });

      return reply.status(201).send(client);
    }
  );

  server.get(
    "/clients",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Listar clientes",
        response: {
          200: z.array(clientSchema),
        },
      },
    },
    async () => {
      return prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    }
  );

  server.get(
    "/clients/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Buscar cliente por id",
        params: clientParamsSchema,
        response: {
          200: clientSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const client = await prisma.client.findUnique({ where: { id } });

      if (!client) {
        return reply.status(404).send({ message: "Cliente não encontrado" });
      }

      return client;
    }
  );

  server.put(
    "/clients/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Atualizar cliente",
        params: clientParamsSchema,
        body: updateClientSchema,
        response: {
          200: clientSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, address, phone } = request.body;

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        return reply.status(404).send({ message: "Cliente não encontrado" });
      }

      const updated = await prisma.client.update({
        where: { id },
        data: { name, address, phone },
      });

      return updated;
    }
  );

  server.delete(
    "/clients/:id",
    {
      schema: {
        tags: ["Clientes"],
        summary: "Remover cliente",
        params: clientParamsSchema,
        response: {
          200: messageSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        return reply.status(404).send({ message: "Cliente não encontrado" });
      }

      await prisma.client.delete({ where: { id } });

      return { message: "Cliente removido com sucesso" };
    }
  );
}
