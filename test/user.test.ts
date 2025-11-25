import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.remove();
  });
  it("should reject to register if request is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("should register new user", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "usertest",
      name: "usertest",
      password: "secret",
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe("usertest");
    expect(response.body.data.name).toBe("usertest");
    expect(response.body.data.password).toBeUndefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.remove();
  });

  it("should reject if request is invalid", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "wrongusername",
      password: "wrongpassword",
    });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
  it("should login user", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "usertest",
      password: "secret",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.username).toBe("usertest");
    expect(response.body.data.name).toBe("usertest");
    expect(response.body.data.password).toBeUndefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.remove();
  });
  it("should get current user", async () => {
    const response = await supertest(web).get("/api/users/current").set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("usertest");
    expect(response.body.data.name).toBe("usertest");
    expect(response.body.data.password).toBeUndefined();
  });
  it("should reject token invalid", async () => {
    const response = await supertest(web).get("/api/users/current").set("Authorization", "wrongtoken");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.remove();
  });
  it("should update logined user", async () => {
    const response = await supertest(web).patch("/api/users/current").set("Authorization", "testtoken").send({
      name: "updateuser",
      password: "updatepassword",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
  });
  it("should reject to update if request is invalid", async () => {
    const response = await supertest(web).patch("/api/users/current").set("Authorization", "testtoken").send({
      name: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.remove();
  });
  it("should logout logined user", async () => {
    const response = await supertest(web).patch("/api/users/current").set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeUndefined();
  });
});
