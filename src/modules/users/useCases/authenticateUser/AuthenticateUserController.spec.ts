import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Rosa Rodriquez",
      email: "fe@jakege.th",
      password: "90654",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
