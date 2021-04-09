import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it("should be able to get a statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: "freela",
      amount: 4555,
      type: OperationType.DEPOSIT,
    })

    const result = await getStatementOperationUseCase.execute(
      {
        user_id: user.id as string,
        statement_id: statement.id as string,
      }
    );

    expect(result).toHaveProperty("id");
  });

  it("should not be able to get a statement operation with a non-exists user", async () => {
    await expect(getStatementOperationUseCase.execute({
        user_id: "non-exists-user",
        statement_id: "statement",
      })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a statement operation with a non-exists statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    });

    await expect(getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "non-exists-statement",
      })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
