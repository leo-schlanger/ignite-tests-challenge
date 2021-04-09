import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Rosa Rodriquez",
      email: "fe@jakege.th",
      password: "90654",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });


    expect(response.status).toBe(200);
  });

  it("should not be able to get balance with user not authenticated", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")


    expect(response.status).toBe(401);
  });
});
