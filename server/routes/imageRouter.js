const imageRouter = require("express").Router();
const Image = require("../models/Image");
// const { upload } = require("../middleware/ImageUpload");
const { upload } = require("../utils/file");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const fileUnlink = promisify(fs.unlink);

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보, public 유무 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");

    const image = await new Image({
      user: {
        _id: req.user.id, // _id를 자동으로 string으로 변환
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: true }, {}, {}); // 탐색, 수정, 옵션
  res.json(images);
});

imageRouter.delete("/:imageId", async (req, res) => {
  // 1. uploads 폴더에 있는 사진 데이터를 삭제
  // 2. DB에 있는 image 문서를 삭제
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지 ID입니다.");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId });

    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });

    await fileUnlink(`./uploads/${image.key}`); // path(경로)에 있는 파일을 지울건지, CB
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", image });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  // 유저 권한 확인
  // like 중복 확인
  try {
    if (!req.user) throw new Error("좋아요 권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID 입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // 유저 권한 확인
  // like 중복 취소 확인
  try {
    if (!req.user) throw new Error("좋아요 권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID 입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = imageRouter;
