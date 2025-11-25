"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
exports.logger = winston_1.default.createLogger({
    level: "debug",
    format: combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
