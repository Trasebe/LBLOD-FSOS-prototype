import expressWinston from "express-winston";
import { transports, format, createLogger } from "winston";

const { combine, prettyPrint, colorize, printf } = format;

const myFormat = printf(
  ({ level, timestamp, label = "FABRIC", message }) =>
    `\n${level}: [${label} - ${timestamp}] - ${message} \n`
);

const defaultTransports = [
  new transports.Console({
    format: format.combine(format.prettyPrint(), format.colorize())
  })
];

const Logger = createLogger({
  format: combine(format.timestamp(), prettyPrint(), colorize(), myFormat),
  transports: [new transports.Console()],
  handleExceptions: true,
  exitOnError: false
});

export const expressLogger = expressWinston.logger({
  meta: false,
  transports: defaultTransports
});

export const expressErrorLogger = expressWinston.errorLogger({
  meta: false,
  blacklistedMetaFields: ["process", "trace", "os", "req"],
  transports: defaultTransports
});

export default Logger;
