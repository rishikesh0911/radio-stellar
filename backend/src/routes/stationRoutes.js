const express = require("express");
const router = express.Router();

const controller = require("../controllers/stationController");

router.get("/search", controller.searchStations);
router.get("/popular", controller.popularStations);
router.get("/countries", controller.getCountries);
router.get("/languages", controller.getLanguages);
router.get("/:uuid", controller.getStation);

module.exports = router;
