import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to get a balance", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    });

    const result = await getBalanceUseCase.execute({user_id: user.id as string});

    expect(result).toHaveProperty("balance");
    expect(result).toHaveProperty("statement");
  });

  it("should not be able to get a balance with a non-exists user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "non-exists-user"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
