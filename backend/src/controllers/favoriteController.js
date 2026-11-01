const Favorite = require("../models/Favorite");

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.find({
    userId: req.user._id
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: favorites
  });
};

exports.addFavorite = async (req, res) => {
  const {
    stationuuid,
    name,
    country,
    favicon,
    url_resolved
  } = req.body;

  if (!stationuuid) {
    return res.status(400).json({
      message: "Station UUID is required"
    });
  }

  const favorite = await Favorite.findOneAndUpdate(
    {
      userId: req.user._id,
      stationuuid
    },
    {
      $setOnInsert: {
        userId: req.user._id,
        stationuuid,
        name,
        country,
        favicon,
        url_resolved
      }
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );

  res.status(201).json({
    success: true,
    data: favorite
  });
};

exports.removeFavorite = async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!favorite) {
    return res.status(404).json({
      message: "Favorite not found"
    });
  }

  res.json({
    success: true,
    message: "Favorite removed"
  });
};