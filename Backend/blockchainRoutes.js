const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-startup", authMiddleware, blockchainController.createStartupOnBlockchain);
router.get("/startup/:startupId", blockchainController.getStartupBlockchain);
router.get("/startups", blockchainController.getAllStartupsBlockchain);
router.get("/startup/:startupId/investments", blockchainController.getInvestmentsForStartup);
router.post("/invest/:startupId", authMiddleware, blockchainController.investInStartupOnBlockchain);

module.exports = router;
