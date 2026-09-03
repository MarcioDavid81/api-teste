import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  productParamsSchema,
  productSchema,
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.js";
import { errorSchema, messageSchema } from "../schemas/common.js";

export async function productRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/products",
    {
      schema: {
        tags: ["Produtos"],
        summary: "Cadastro de produtos",
        body: createProductSchema,
        response: {
          201: productSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, productClassId } = request.body;
      const product = await prisma.product.create({
        data: {
          name,
          productClassId,
        },
        include: { productClass: true },
      });
      return reply.status(201).send(product);
    },
  );

  server.get(
    "/products",
    {
      schema: {
        tags: ["Produtos"],
        summary: "Listar produtos",
        response: {
          200: z.array(productSchema),
        },
      },
    },
    async () => {
      return prisma.product.findMany({
        orderBy: { name: "asc" },
        include: { productClass: true },
      });
    },
  );

  server.get(
    "/products/:id",
    {
      schema: {
        tags: ["Produtos"],
        summary: "Buscar produto por id",
        params: productParamsSchema,
        response: {
          200: productSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const product = await prisma.product.findUnique({
        where: { id },
        include: { productClass: true },
      });
      if (!product) {
        return reply.status(404).send({ message: "Produto não encontrado" });
      }
      return product;
    },
  );

  server.put(
    "/products/:id",
    {
      schema: {
        tags: ["Produtos"],
        summary: "Atualizar produto",
        params: productParamsSchema,
        body: updateProductSchema,
        response: {
          200: productSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, productClassId } = request.body;
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return reply.status(404).send({ message: "Produto não encontrado" });
      }
      const updated = await prisma.product.update({
        where: { id },
        data: { name, productClassId },
        include: { productClass: true },
      });
      return updated;
    },
  );

  server.delete(
    "/products/:id",
    {
      schema: {
        tags: ["Produtos"],
        summary: "Remover produto",
        params: productParamsSchema,
        response: {
          200: messageSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return reply.status(404).send({ message: "Produto não encontrado" });
      }
      await prisma.product.delete({ where: { id } });
      return reply.status(200).send({ message: "Produto removido" });
    },
  );
}
