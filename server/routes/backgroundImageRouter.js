require("dotenv").config();
const backgroundImageRouter = require("express").Router();
const backgroundImage = require("../models/backgroundImage");
const { backgroundUpload } = require("../middleware/backgroundImageUpload");
const mongoose = require("mongoose");
const { s3 } = require("../data/aws");
const { AWS_BUCKET_NAME } = process.env;

// background 이미지 저장
backgroundImageRouter.post(
  "/post",
  backgroundUpload.single("image"),
  async (req, res) => {
    try {
      if (!req.body.id) throw new Error("권한이 없습니다.");

      const bgImage = await new backgroundImage({
        user:{
            _id: req.body.id,
            email: req.body.email,
            name: req.body.name,
        },
      key: req.file.key,
      originalFileName: req.file.originalname,
    }).save();

      return res.json(bgImage);
    } catch (err) {
      return res.status(400);
    }
  }
);

// background 이미지 배포
backgroundImageRouter.get("/show/:id", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const bgImages = await backgroundImage.find({ _id: req.user.id });
    res.json(bgImages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// background 이미지 삭제
backgroundImageRouter.delete("/delete", async (req, res) => {
  try {
    if (!req.body) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.body.img.desc))
      throw new Error("올바르지 않은 이미지 ID입니다.");
    const bgImage = await backgroundImage.findOneAndDelete({
      _id: req.body.img.desc,
    });

    if (!bgImage)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });

    s3.deleteObject(
      { Bucket: AWS_BUCKET_NAME, Key: req.body.img.key },
      (error, data) => {
        if (error) throw error;
      }
    );
    res.json({ message: "사진이 삭제되었습니다.", bgImage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = backgroundImageRouter;
