import { Router } from "express";

import chainRoutes from "./endpoints/chain/chain.route";
import authRoutes from "./endpoints/auth/auth.route";
import offlineRoutes from "./endpoints/offline/offline.route";

export default Router()
  .get("/health-check", (req, res) =>
    res.send("OK")
  ) /** GET /health-check - Check service health */

  .use("/chain", chainRoutes) // mount chaincode routes at /chain
  .use("/auth", authRoutes) // mount auth routes at /auth
  .use("/offline", offlineRoutes);
