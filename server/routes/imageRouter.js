require("dotenv").config();
const imageRouter = require("express").Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/ImageUpload");
const mongoose = require("mongoose");
const { s3 } = require("../data/aws");
const { AWS_BUCKET_NAME } = process.env;

// 공유, 프레임 변경, 저장에서 저장버튼
imageRouter.post("/post", upload.single("file"), async (req, res) => {
  const image = await new Image({
    user: {
      _id: req.body.id,
      name: req.body.username,
      email: req.body.useremail,
    },
    public: req.body.public,
    key: req.file.key,
    originalFileName: req.file.originalname,
  }).save();

  try {
    if (!req.body.username) throw new Error("권한이 없습니다.");
    return res.json(image);
  } catch (err) {
    return res.status(400);
  }
});

imageRouter.post("/album", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: "true" }).sort({
    createdAt: -1,
  }); // 탐색, 수정, 옵션
  res.json(images);
});

imageRouter.get("/album/top10", async (req, res) => {
  // public 이미지들만 제공, 좋아요 순, 최대 20개
  const images = await Image.find({ public: true })
    .sort({ likes_count: -1, createdAt: -1 })
    .limit(10); // 탐색, 수정, 옵션
  res.json(images);
});

imageRouter.post("/album/me", async (req, res) => {
  // 내가 찍은 사진들 제공
  if (req.body.id) {
    const images = await Image.find({ "user._id": req.body.id, "user.email": req.body.email }).sort({
      createdAt: -1,
    }); // 탐색, 수정, 옵션
    res.json(images);
  }
});

imageRouter.delete("/album/delete", async (req, res) => {
  try {
    if (!req.body.img.owner) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.body.img.desc))
      throw new Error("올바르지 않은 이미지 ID입니다.");
    const image = await Image.findOneAndDelete({ _id: req.body.img.desc });

    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });

    s3.deleteObject(
      { Bucket: AWS_BUCKET_NAME, Key: req.body.img.key },
      (error, data) => {
        if (error) throw error;
      }
    );
    res.json({ message: "사진이 삭제되었습니다.", image });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 본인 사진들만 리턴 (public 유무 상관없이)
imageRouter.get("/:id/album", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const images = await Image.find({ "user._id": req.user.id }); // ._id는 쓸 수 없으므로 ""로 묶음 -> Mongo DB가 알아서 파싱해줌
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/:imageId/:userId", async (req, res) => {
  const image = await Image.find({
    _id: req.params.imageId,
    likes: req.params.userId,
  });
  if (image.length !== 0) res.json({ isLiked: true });
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.body.user) throw new Error("좋아요 권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.body.imageId))
      throw new Error("올바르지 않은 이미지ID 입니다.");
    const image = await Image.findOne({
      _id: req.body.imageId,
      likes: req.body.user,
    });

    if (image === null) {
      const image = await Image.findOneAndUpdate(
        { _id: req.body.imageId },
        {
          $addToSet: { likes: req.body.user },
          $inc: { likes_count: 1 },
        },
        { new: true }
      );
      res.json(image);
    } else {
      const image = await Image.findOneAndUpdate(
        { _id: req.body.imageId },
        { $pull: { likes: req.body.user }, $inc: { likes_count: -1 } },
        { new: true, _id: false }
      );
      res.json(image);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = imageRouter;
