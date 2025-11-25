"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = __importDefault(require("zod"));
class ContactValidation {
}
exports.ContactValidation = ContactValidation;
ContactValidation.CREATE = zod_1.default.object({
    first_name: zod_1.default.string().min(1).max(100),
    last_name: zod_1.default.string().min(1).max(100).optional(),
    email: zod_1.default.string().min(1).max(100).email().optional(),
    phone: zod_1.default.string().min(1).max(20).optional(),
});
ContactValidation.UPDATE = zod_1.default.object({
    id: zod_1.default.number().positive(),
    first_name: zod_1.default.string().min(1).max(100),
    last_name: zod_1.default.string().min(1).max(100),
    email: zod_1.default.string().min(1).max(100).email().optional(),
    phone: zod_1.default.string().min(1).max(20).optional(),
});
ContactValidation.SEARCH = zod_1.default.object({
    name: zod_1.default.string().min(1).optional(),
    phone: zod_1.default.string().min(1).optional(),
    email: zod_1.default.string().min(1).optional(),
    page: zod_1.default.number().min(1).positive(),
    size: zod_1.default.number().min(1).max(100).positive(),
});
