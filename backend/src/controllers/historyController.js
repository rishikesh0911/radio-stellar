const History = require("../models/History");

exports.addHistory = async (req, res) => {
  const { stationuuid, stationName, country, favicon } = req.body;

  if (!stationuuid) {
    return res.status(400).json({
      message: "Station UUID is required"
    });
  }

  const history = await History.create({
    userId: req.user._id,
    stationuuid,
    stationName,
    country,
    favicon
  });

  res.status(201).json({
    success: true,
    data: history
  });
};

exports.getHistory = async (req, res) => {
  const history = await History.find({
    userId: req.user._id
  })
    .sort({ playedAt: -1 })
    .limit(50);

  res.json({
    success: true,
    data: history
  });
};