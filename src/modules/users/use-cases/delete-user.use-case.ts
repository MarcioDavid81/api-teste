import type { IUsersRepository } from "../repositories/IUsersRepository.js";
import { UserNotFoundError } from "./get-user.use-case.js";

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }
    await this.usersRepository.delete(id);
  }
}
