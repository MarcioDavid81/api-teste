import type { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import type { z } from "zod";
import type {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from "../../../schemas/user.js";
import {
  CreateUserUseCase,
  UserAlreadyExistsError,
} from "../use-cases/create-user.use-case.js";
import { DeleteUserUseCase } from "../use-cases/delete-user.use-case.js";
import {
  GetUserUseCase,
  UserNotFoundError,
} from "../use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "../use-cases/list-users.use-case.js";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case.js";

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
type UserParams = z.infer<typeof userParamsSchema>;

type RouteWithParams<R extends RouteGenericInterface> =
  FastifyRequest<R> & { params: UserParams };
type RouteWithBody<R extends RouteGenericInterface, B> =
  FastifyRequest<R> & { body: B };
type RouteWithParamsAndBody<R extends RouteGenericInterface, B> =
  FastifyRequest<R> & { params: UserParams; body: B };

export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create<R extends RouteGenericInterface>(
    request: RouteWithBody<R, CreateUserBody>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.createUserUseCase.execute(request.body);
      return reply.status(201).send(user);
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        return reply.status(409).send({ message: err.message });
      }
      throw err;
    }
  }

  async list(_request: FastifyRequest, _reply: FastifyReply) {
    return this.listUsersUseCase.execute();
  }

  async getById<R extends RouteGenericInterface>(
    request: RouteWithParams<R>,
    reply: FastifyReply
  ) {
    try {
      return this.getUserUseCase.execute(request.params.id);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      throw err;
    }
  }

  async update<R extends RouteGenericInterface>(
    request: RouteWithParamsAndBody<R, UpdateUserBody>,
    reply: FastifyReply
  ) {
    try {
      return this.updateUserUseCase.execute(request.params.id, request.body);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      if (err instanceof UserAlreadyExistsError) {
        return reply.status(409).send({ message: err.message });
      }
      throw err;
    }
  }

  async delete<R extends RouteGenericInterface>(
    request: RouteWithParams<R>,
    reply: FastifyReply
  ) {
    try {
      await this.deleteUserUseCase.execute(request.params.id);
      return reply.status(200).send({ message: "Usuário removido" });
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      throw err;
    }
  }
}
