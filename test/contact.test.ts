import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { ContactTest, UserTest } from "./test-util";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should create new contact", async () => {
    const response = await supertest(web).post("/api/contacts").set("Authorization", "testtoken").send({
      first_name: "testcontactfirst",
      last_name: "testcontactlast",
      email: "testcontact@mail.com",
      phone: "081382377481",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("testcontactfirst");
    expect(response.body.data.last_name).toBe("testcontactlast");
    expect(response.body.data.email).toBe("testcontact@mail.com");
    expect(response.body.data.phone).toBe("081382377481");
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should create new contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).get(`/api/contacts/${contact.id}`).set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("testcontactfirst");
    expect(response.body.data.last_name).toBe("testcontactlast");
    expect(response.body.data.email).toBe("testcontact@mail.com");
    expect(response.body.data.phone).toBe("081382377481");
  });
  it("should reject if request is invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).get(`/api/contacts/99999`).set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.remove();
    await UserTest.remove();
  });
  it("should update exiting contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).put(`/api/contacts/${contact.id}`).set("Authorization", "testtoken").send({
      first_name: "updatecontactfirst",
      last_name: "updatecontactlast",
      email: "updatecontact@mail.com",
      phone: "081999999999",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("updatecontactfirst");
    expect(response.body.data.last_name).toBe("updatecontactlast");
    expect(response.body.data.email).toBe("updatecontact@mail.com");
    expect(response.body.data.phone).toBe("081999999999");
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.remove();
    await UserTest.remove();
  });
  it("should delete exiting contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).delete(`/api/contacts/${contact.id}`).set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });
  it("should reject if request is invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).delete(`/api/contacts/99999`).set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.createMany();
  });

  afterEach(async () => {
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should return all contacts if no query given", async () => {
    const response = await supertest(web).get(`/api/contacts`).set("Authorization", "testtoken");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  it("should return contacts for page n", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .set("Authorization", "testtoken")
      .query({ page: 2, size: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeLessThanOrEqual(10);
    expect(response.body.paging.current_page).toBe(2);
  });
  it("should search contacts by name, email, and phone", async () => {
    const response = await supertest(web).get(`/api/contacts`).set("Authorization", "testtoken").query({
      phone: "081382377401",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].first_name).toContain("testcontact");
  });
});
