import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;

describe("Create Statement Controller", () => {
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

  it("should be able to create a new deposit statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "PayDay"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able to create a new withdraw statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "PayDay"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });


    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("withdraw");
  });

  it("should not be able to create a new withdraw statement with insufficient funds", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fe@jakege.th",
      password: "90654",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 1000,
        description: "PayDay"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });


    expect(response.status).toBe(400);
  });

  it("should not be able to create a new withdraw statement with an non-authenticated user", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 1000,
        description: "PayDay"
      });


    expect(response.status).toBe(401);
  });

});
