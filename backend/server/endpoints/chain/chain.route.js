import { Router } from "express";
import expressJwt from "express-jwt";

import chainCtrl from "./chain.controller";
import config from "../../../config/config";

const router = Router(); // eslint-disable-line new-cap

/** POST /chain/invoke/:fcn - Invoke a function (args optional) */
router
  .route("/invoke/:fcn")
  .post(expressJwt({ secret: config.jwtSecret }), chainCtrl.invoke);

/** POST /api/chain/query/:fcn - Query the ledger (args optional) */
router
  .route("/query/:fcn")
  .post(expressJwt({ secret: config.jwtSecret }), chainCtrl.query);

// TODO load and dynamic prepareRequest/param validation
/** Prepare request when API with fcn route parameter is hit */
router.param("fcn", chainCtrl.prepare);

export default router;
