import type { User } from "../../../generated/client.js";
import type { IUsersRepository } from "../repositories/IUsersRepository.js";

export class GetUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("Usuário não encontrado");
    this.name = "UserNotFoundError";
  }
}
