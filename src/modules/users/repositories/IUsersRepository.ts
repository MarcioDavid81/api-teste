import type { User } from "../../../generated/client.js";
import type { CreateUserInput, UpdateUserInput } from "../../../schemas/user.js";

export interface IUsersRepository {
  create(data: CreateUserInput & { password: string }): Promise<User>;
  findMany(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserInput & { password?: string }): Promise<User>;
  delete(id: string): Promise<void>;
}
