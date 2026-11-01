const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/favoriteController");

router.use(authMiddleware);

router.get("/", controller.getFavorites);
router.post("/", controller.addFavorite);
router.delete("/:id", controller.removeFavorite);

module.exports = router;