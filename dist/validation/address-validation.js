"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidation = void 0;
const zod_1 = __importDefault(require("zod"));
class AddressValidation {
}
exports.AddressValidation = AddressValidation;
_a = AddressValidation;
AddressValidation.CREATE = zod_1.default.object({
    contact_id: zod_1.default.number().positive(),
    street: zod_1.default.string().min(1).max(255).optional(),
    city: zod_1.default.string().min(1).max(100).optional(),
    province: zod_1.default.string().min(1).max(100).optional(),
    country: zod_1.default.string().min(1).max(100),
    postal_code: zod_1.default.string().min(1).max(10),
});
AddressValidation.UPDATE = zod_1.default.object({
    contact_id: zod_1.default.number().positive(),
    address_id: zod_1.default.number().positive(),
    street: zod_1.default.string().min(1).max(255).optional(),
    city: zod_1.default.string().min(1).max(100).optional(),
    province: zod_1.default.string().min(1).max(100).optional(),
    country: zod_1.default.string().min(1).max(100),
    postal_code: zod_1.default.string().min(1).max(10),
});
AddressValidation.GET = zod_1.default.object({
    contact_id: zod_1.default.number().positive(),
    address_id: zod_1.default.number().positive(),
});
AddressValidation.REMOVE = _a.GET;
