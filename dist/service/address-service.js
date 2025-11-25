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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const address_model_1 = require("../model/address-model");
const validation_1 = require("../validation/validation");
const address_validation_1 = require("../validation/address-validation");
const contact_service_1 = require("./contact-service");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class AddressService {
    static checkAddress(contactId, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield database_1.prismaClient.address.findFirst({
                where: {
                    id: addressId,
                    contact_id: contactId,
                },
            });
            if (!address) {
                throw new response_error_1.ResponseError(404, "address not found");
            }
            return address;
        });
    }
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(address_validation_1.AddressValidation.CREATE, request);
            yield contact_service_1.ContactService.checkContact(user.username, createRequest.contact_id);
            const address = yield database_1.prismaClient.address.create({
                data: createRequest,
            });
            return (0, address_model_1.toAddressResponse)(address);
        });
    }
    static get(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const getRequest = validation_1.Validation.validate(address_validation_1.AddressValidation.GET, request);
            yield contact_service_1.ContactService.checkContact(user.username, getRequest.contact_id);
            const address = yield this.checkAddress(getRequest.contact_id, getRequest.address_id);
            return (0, address_model_1.toAddressResponse)(address);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(address_validation_1.AddressValidation.UPDATE, request);
            yield contact_service_1.ContactService.checkContact(user.username, updateRequest.contact_id);
            yield this.checkAddress(updateRequest.contact_id, updateRequest.address_id);
            const { contact_id, address_id } = updateRequest, addressData = __rest(updateRequest, ["contact_id", "address_id"]);
            const address = yield database_1.prismaClient.address.update({
                where: {
                    id: address_id,
                    contact_id: contact_id,
                },
                data: Object.assign({}, addressData),
            });
            return (0, address_model_1.toAddressResponse)(address);
        });
    }
    static remove(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const removeRequest = validation_1.Validation.validate(address_validation_1.AddressValidation.REMOVE, request);
            yield contact_service_1.ContactService.checkContact(user.username, removeRequest.contact_id);
            yield this.checkAddress(removeRequest.contact_id, removeRequest.address_id);
            const address = yield database_1.prismaClient.address.delete({
                where: {
                    id: removeRequest.address_id,
                    contact_id: removeRequest.contact_id,
                },
            });
            return (0, address_model_1.toAddressResponse)(address);
        });
    }
    static list(user, contact_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield contact_service_1.ContactService.checkContact(user.username, contact_id);
            const addresses = yield database_1.prismaClient.address.findMany({
                where: {
                    contact_id: contact_id,
                },
            });
            return addresses.map((address) => (0, address_model_1.toAddressResponse)(address));
        });
    }
}
exports.AddressService = AddressService;
