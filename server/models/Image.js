const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true }, 
      username: { type: String, required: true },
    },

    public: { type: Boolean, required: true, default: false }, // 공개, 비공개

    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true } // 이미지가 저장되는 시간을 자동으로 저장
);

module.exports = mongoose.model("image", ImageSchema);
