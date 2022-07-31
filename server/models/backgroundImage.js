const mongoose = require("mongoose");

const backgroundImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("backgroundImage", backgroundImageSchema);
