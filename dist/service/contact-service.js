"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("../model/contact-model");
const validation_1 = require("../validation/validation");
const contact_validation_1 = require("../validation/contact-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ContactService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.CREATE, request);
            const record = Object.assign(Object.assign({}, createRequest), { username: user.username });
            const contact = yield database_1.prismaClient.contact.create({
                data: record,
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static checkContact(username, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield database_1.prismaClient.contact.findFirst({
                where: { id: contactId, username: username },
            });
            if (!contact) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            return contact;
        });
    }
    static get(user, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield this.checkContact(user.username, contactId);
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.UPDATE, request);
            yield this.checkContact(user.username, request.id);
            const contact = yield database_1.prismaClient.contact.update({
                where: {
                    id: updateRequest.id,
                    username: user.username,
                },
                data: updateRequest,
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static remove(user, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkContact(user.username, contactId);
            const contact = yield database_1.prismaClient.contact.delete({
                where: {
                    id: contactId,
                    username: user.username,
                },
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static search(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.SEARCH, request);
            console.log(searchRequest);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.name) {
                filters.push({
                    OR: [
                        {
                            first_name: {
                                contains: searchRequest.name,
                            },
                        },
                        {
                            last_name: {
                                contains: searchRequest.name,
                            },
                        },
                    ],
                });
            }
            if (searchRequest.email) {
                filters.push({
                    email: {
                        contains: searchRequest.email,
                    },
                });
            }
            if (searchRequest.phone) {
                filters.push({
                    phone: {
                        contains: searchRequest.phone,
                    },
                });
            }
            const contact = yield database_1.prismaClient.contact.findMany({
                where: {
                    username: user.username,
                    AND: filters,
                },
                skip: skip,
                take: searchRequest.size,
            });
            const total = yield database_1.prismaClient.contact.count({
                where: {
                    username: user.username,
                    AND: filters,
                },
            });
            return {
                data: contact.map((contact) => (0, contact_model_1.toContactResponse)(contact)),
                paging: {
                    current_page: searchRequest.page,
                    total_page: Math.ceil(total / searchRequest.size),
                    size: searchRequest.size,
                },
            };
        });
    }
}
exports.ContactService = ContactService;
