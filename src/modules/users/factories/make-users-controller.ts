import { UsersController } from "../controllers/UsersController.js";
import { PrismaUsersRepository } from "../repositories/implementations/PrismaUsersRepository.js";
import { CreateUserUseCase } from "../use-cases/create-user.use-case.js";
import { DeleteUserUseCase } from "../use-cases/delete-user.use-case.js";
import { GetUserUseCase } from "../use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "../use-cases/list-users.use-case.js";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case.js";

export function makeUsersController(): UsersController {
  const usersRepository = new PrismaUsersRepository();

  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const listUsersUseCase = new ListUsersUseCase(usersRepository);
  const getUserUseCase = new GetUserUseCase(usersRepository);
  const updateUserUseCase = new UpdateUserUseCase(usersRepository);
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository);

  return new UsersController(
    createUserUseCase,
    listUsersUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase
  );
}
