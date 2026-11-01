const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/historyController");

router.use(authMiddleware);

router.get("/", controller.getHistory);
router.post("/", controller.addHistory);

module.exports = router;