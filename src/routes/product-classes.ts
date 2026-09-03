import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  productClassParamsSchema,
  productClassSchema,
  createProductClassSchema,
  updateProductClassSchema,
} from "../schemas/product-class.js";
import { errorSchema, messageSchema } from "../schemas/common.js";

export async function productClassRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/product-classes",
    {
      schema: {
        tags: ["Classes de Produtos"],
        summary: "Cadastro de classes de produtos",
        body: createProductClassSchema,
        response: {
          201: productClassSchema,
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const productClass = await prisma.productClass.create({
        data: { name },
      });
      return reply.status(201).send(productClass);
    }
  );

  server.get(
    "/product-classes",
    {
      schema: {
        tags: ["Classes de Produtos"],
        summary: "Listar classes de produtos",
        response: {
          200: z.array(productClassSchema),
        },
      },
    },
    async () => {
      return prisma.productClass.findMany({ orderBy: { name: "asc" } });
    }
  );

  server.get(
    "/product-classes/:id",
    {
      schema: {
        tags: ["Classes de Produtos"],
        summary: "Buscar classe de produto por id",
        params: productClassParamsSchema,
        response: {
          200: productClassSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const productClass = await prisma.productClass.findUnique({ where: { id } });
      if (!productClass) {
        return reply.status(404).send({ message: "Classe de produto não encontrado" });
      }
      return productClass;
    }
  );

  server.put(
    "/product-classes/:id",
    {
      schema: {
        tags: ["Classes de Produtos"],
        summary: "Atualizar classe de produto",
        params: productClassParamsSchema,
        body: updateProductClassSchema,
        response: {
          200: productClassSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;
      const productClass = await prisma.productClass.findUnique({ where: { id } });
      if (!productClass) {
        return reply.status(404).send({ message: "Classe de produto não encontrado" });
      }
      const updated = await prisma.productClass.update({
        where: { id },
        data: { name },
      });
      return updated;
    }
  );

  server.delete(
    "/product-classes/:id",
    {
      schema: {
        tags: ["Classes de Produtos"],
        summary: "Remover classe de produto",
        params: productClassParamsSchema,
        response: {
          200: messageSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const productClass = await prisma.productClass.findUnique({ where: { id } });
      if (!productClass) {
        return reply.status(404).send({ message: "Classe de produto não encontrado" });
      }
      await prisma.productClass.delete({ where: { id } });
      return reply.status(200).send({ message: "Classe de produto removida" });
    }
  );
}
