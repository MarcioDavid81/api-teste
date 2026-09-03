import bcrypt from "bcryptjs";
import type { User } from "../../../generated/client.js";
import type { CreateUserInput } from "../../../schemas/user.js";
import type { IUsersRepository } from "../repositories/IUsersRepository.js";

const SALT_ROUNDS = 10;

export class CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(data: CreateUserInput): Promise<User> {
    const existing = await this.usersRepository.findByEmail(data.email);
    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.usersRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
  }
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super("E-mail já cadastrado");
    this.name = "UserAlreadyExistsError";
  }
}
