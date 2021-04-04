import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show an user", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      password: "1234",
      name: "User Test",
    })

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result.id).toBe(user.id);
  });

  it("should not be able to show a non-existing user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existing-user");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
