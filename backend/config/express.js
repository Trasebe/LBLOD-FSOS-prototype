import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";
import expressWinston from "express-winston";
import helmet from "helmet";
import queue from "express-queue";

import routes from "../server/index.route";
import config from "./config";
import APIError, { ErrorParser } from "../server/utils/APIError";
import { expressLogger, expressErrorLogger } from "./Log";

const app = express();

if (config.env === "development") {
  app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// TODO proper queue'ing instead of blocking
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

// enable detailed API logging in dev env BEFORE the router
if (config.env === "development") {
  expressWinston.responseWhitelist.push("body");
  expressWinston.requestWhitelist.push("body");
  app.use(expressLogger);
}

// mount all routes on /api path
app.use("/", routes);

// if error is not an instanceOf APIError, convert it.
app.use(ErrorParser);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
});

// express-winston errorLogger makes sense AFTER the router.
app.use(expressErrorLogger);

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === "development" ? err.stack : {}
  })
);

export default app;
