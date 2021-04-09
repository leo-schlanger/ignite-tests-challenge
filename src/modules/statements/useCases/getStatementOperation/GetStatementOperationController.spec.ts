import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Rosa Rodriquez",
      email: "fe@jakege.th",
      password: "90654",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const responseOperation = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "PayDay"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const response = await request(app)
      .get(`/api/v1/statements/${responseOperation.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to get a statement operation with non-authenticated user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const responseOperation = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "PayDay"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const response = await request(app)
      .get(`/api/v1/statements/${responseOperation.body.id}`)

    expect(response.status).toBe(401);
  });
});
