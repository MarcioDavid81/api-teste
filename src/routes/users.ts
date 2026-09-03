import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { makeUsersController } from "../modules/users/factories/make-users-controller.js";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  userSchema,
} from "../schemas/user.js";
import { errorSchema, messageSchema } from "../schemas/common.js";

export async function userRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const usersController = makeUsersController();

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
    (request, reply) => usersController.create(request, reply),
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
    (request, reply) => usersController.list(request, reply),
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
    (request, reply) => usersController.getById(request, reply),
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
    (request, reply) => usersController.update(request, reply),
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
    (request, reply) => usersController.delete(request, reply),
  );
}
