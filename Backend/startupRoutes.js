const express = require("express");
const {
  createStartup,
  getAllStartups,
  getStartupById,
  investInStartup,
} = require("../controller/startupController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createStartup);
router.get("/", getAllStartups);
router.get("/:id", getStartupById);
router.post("/:id/invest", authMiddleware, investInStartup);

module.exports = router;
