import express from "express";
import offineCtrl from "./offline.controller";

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route("/getUnsignedProposal").post(offineCtrl.getUnsignedProposal);
router.route("/getUnsignedTransaction").post(offineCtrl.getUnsignedTransaction);
router.route("/sendTransaction").post(offineCtrl.sendTransaction);
router.route("/signEventProposal").post(offineCtrl.signEventProposal);
export default router;
