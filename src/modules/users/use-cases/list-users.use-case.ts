import type { User } from "../../../generated/client.js";
import type { IUsersRepository } from "../repositories/IUsersRepository.js";

export class ListUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    return this.usersRepository.findMany();
  }
}
