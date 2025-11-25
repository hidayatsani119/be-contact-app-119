import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId(\\d+)/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.remove();
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should create new addres for exiting contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testtoken")
      .send({
        street: "testsreet",
        city: "testcity",
        province: "testprovince",
        country: "testcountry",
        postal_code: "postalcode",
      });
    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.street).toBe("testsreet");
    expect(response.body.data.city).toBe("testcity");
    expect(response.body.data.province).toBe("testprovince");
    expect(response.body.data.country).toBe("testcountry");
    expect(response.body.data.postal_code).toBe("postalcode");
  });
});

describe("GET /api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.remove();
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should get exiting address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.street).toBe("testsreet");
    expect(response.body.data.city).toBe("testcity");
    expect(response.body.data.province).toBe("testprovince");
    expect(response.body.data.country).toBe("testcountry");
    expect(response.body.data.postal_code).toBe("postalcode");
  });

  it("should reject if request is invalid", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/999999`)
      .set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.remove();
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should update exiting address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .patch(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testtoken")
      .send({
        street: "Utestsreet",
        city: "Utestcity",
        province: "Utestprovince",
        country: "Utestcountry",
        postal_code: "UpCode",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.street).toBe("Utestsreet");
    expect(response.body.data.city).toBe("Utestcity");
    expect(response.body.data.province).toBe("Utestprovince");
    expect(response.body.data.country).toBe("Utestcountry");
    expect(response.body.data.postal_code).toBe("UpCode");
  });
});

describe("DELETE /api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.remove();
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should delete exiting address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });
});

describe("GET /api/contacts/:contactId(\\d+)/addresses/", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.createMany();
  });

  afterEach(async () => {
    await AddressTest.remove();
    await ContactTest.remove();
    await UserTest.remove();
  });

  it("should delete exiting address", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", "testtoken");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(30);
  });
});
