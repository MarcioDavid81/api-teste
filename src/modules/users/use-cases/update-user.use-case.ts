import bcrypt from "bcryptjs";
import type { User } from "../../../generated/client.js";
import type { UpdateUserInput } from "../../../schemas/user.js";
import type { IUsersRepository } from "../repositories/IUsersRepository.js";
import { UserAlreadyExistsError } from "./create-user.use-case.js";
import { UserNotFoundError } from "./get-user.use-case.js";

const SALT_ROUNDS = 10;

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string, data: UpdateUserInput): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }

    if (data.email && data.email !== existingUser.email) {
      const emailInUse = await this.usersRepository.findByEmail(data.email);
      if (emailInUse) {
        throw new UserAlreadyExistsError();
      }
    }

    const updateData: UpdateUserInput & { password?: string } = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    return this.usersRepository.update(id, updateData);
  }
}
