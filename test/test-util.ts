import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { ResponseError } from "../src/error/response-error";
import { Contact } from "@prisma/client";

export class UserTest {
  static async remove() {
    await prismaClient.user.deleteMany({
      where: { username: "usertest" },
    });
  }
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "usertest",
        name: "usertest",
        password: await bcrypt.hash("secret", 10),
        token: "testtoken",
      },
    });
  }
}

export class ContactTest {
  static async create() {
    await prismaClient.contact.create({
      data: {
        username: "usertest",
        first_name: "testcontactfirst",
        last_name: "testcontactlast",
        email: "testcontact@mail.com",
        phone: "081382377481",
      },
    });
  }
  static async remove() {
    await prismaClient.contact.deleteMany({
      where: {
        OR: [
          { first_name: { in: ["updatecontactfirst", "testcontactfirst"] } },
          {
            first_name: {
              startsWith: "testcontact",
            },
          },
        ],
      },
    });
  }

  static async get() {
    const contact = await prismaClient.contact.findFirst({
      where: { username: "usertest" },
    });

    if (!contact) {
      throw new ResponseError(404, "contact not found");
    }

    return contact;
  }
  static async createMany(total: number = 30) {
    const contacts = [];

    for (let i = 1; i <= total; i++) {
      contacts.push({
        username: "usertest",
        first_name: `testcontact${i}`,
        last_name: `lastname${i}`,
        email: `contact${i}@mail.com`,
        phone: `0813823774${i.toString().padStart(2, "0")}`,
      });
    }

    await prismaClient.contact.createMany({
      data: contacts,
    });
  }
}

export class AddressTest {
  static async create() {
    const contact = await ContactTest.get();
    await prismaClient.address.create({
      data: {
        street: "testsreet",
        city: "testcity",
        province: "testprovince",
        country: "testcountry",
        postal_code: "postalcode",
        contact_id: contact.id,
      },
    });
  }

  static async createMany(total: number = 30) {
    const addresses = [];
    const contact = await ContactTest.get();
    for (let i = 1; i <= total; i++) {
      addresses.push({
        street: `testsreet${i}`,
        city: `testcity${i}`,
        province: `testprovince${i}`,
        country: `testcountry${i}`,
        postal_code: `pcode${i}`,
        contact_id: contact.id,
      });
    }
    await prismaClient.address.createMany({
      data: addresses,
    });
  }

  static async remove() {
    await prismaClient.address.deleteMany({
      where: {
        OR: [
          { street: { in: ["testsreet", "Utestsreet"] } },
          {
            street: {
              startsWith: "testsreet",
            },
          },
        ],
      },
    });
  }

  static async get() {
    const address = await prismaClient.address.findFirst({
      where: { street: "testsreet" },
    });
    if (!address) {
      throw new ResponseError(404, "address not found");
    }
    return address;
  }
}
