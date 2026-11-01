const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    stationuuid: {
      type: String,
      required: true
    },

    name: String,
    country: String,
    favicon: String,
    url_resolved: String
  },
  { timestamps: true }
);

favoriteSchema.index(
  { userId: 1, stationuuid: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);