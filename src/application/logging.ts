import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

export const logger = winston.createLogger({
  level: "debug",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
