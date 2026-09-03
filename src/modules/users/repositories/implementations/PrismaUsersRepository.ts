import type { User } from "../../../../generated/client.js";
import { prisma } from "../../../../lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "../../../../schemas/user.js";
import type { IUsersRepository } from "../IUsersRepository.js";

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: CreateUserInput & { password: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findMany(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(
    id: string,
    data: UpdateUserInput & { password?: string }
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
