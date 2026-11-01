const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
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

    stationName: String,
    country: String,
    favicon: String,
    playedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

historySchema.index({ userId: 1, playedAt: -1 });

module.exports = mongoose.model("History", historySchema);