import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create an user", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "freela",
      amount: 4555,
      type: OperationType.DEPOSIT,
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create a statement with a non-exists user", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "invalid_user",
      description: "freela",
      amount: 4555,
      type: OperationType.DEPOSIT,
    };

    await expect( createStatementUseCase.execute(statement))
      .rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
