/* eslint-disable no-global-assign */
import mongoose from "mongoose";
import util from "util";
import bluebird from "bluebird";

import https from "https";
import fs from "fs";

// config should be imported before importing any other file
import config from "../config/config";

// Other imports
import app from "../config/express";
import network from "./services/network.service";
import logger from "../config/Log";

const debug = require("debug")("hlf-express:index");

try {
  (async () => {
    // make bluebird default Promise
    Promise = bluebird;
    mongoose.Promise = Promise;

    // connect to mongo db
    const mongoUri = config.mongo.host;
    mongoose.connect(
      mongoUri,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        poolSize: 2,
        promiseLibrary: global.Promise
      }
    );
    mongoose.connection.on("error", () => {
      throw new Error(`unable to connect to database: ${mongoUri}`);
    });

    // print mongoose logs in dev env
    if (config.mongooseDebug) {
      mongoose.set("debug", (collectionName, method, query, doc) => {
        debug(
          `${collectionName}.${method}`,
          util.inspect(query, false, 20),
          doc
        );
      });
    }

    const admin = await network.initFabric();
    logger.info(admin);

    if (config.env === "PRODUCTION") {
      const basePath = "/etc/letsencrypt/live/<domain-name>";
      const serverOptions = {
        key: fs.readFileSync(`${basePath}/privkey.pem`, "utf8"),
        cert: fs.readFileSync(`${basePath}/cert.pem`, "utf8"),
        ca: [fs.readFileSync(`${basePath}/chain.pem`, "utf8")]
      };

      https.createServer(serverOptions, app).listen(8080, () => {
        logger.info(`server started on port ${config.port} (${config.env})`);
      });
    } else {
      app.listen(config.port, () => {
        logger.info(`server started on port ${config.port} (${config.env})`);
      });
    }
  })();
} catch (e) {
  logger.error(e);
}
