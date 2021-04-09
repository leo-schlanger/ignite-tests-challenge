import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create an exists user", async () => {
    const user: ICreateUserDTO = {
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    };

    await createUserUseCase.execute(user);

    await expect(
      createUserUseCase.execute(user)
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
