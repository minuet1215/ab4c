const imageRouter = require("express").Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/ImageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const fileUnlink = promisify(fs.unlink);
const { User } = require("../models/User");

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

imageRouter.get("/album", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: "true" }); // 탐색, 수정, 옵션
  res.json(images);
});

imageRouter.post("/album/me", async (req, res) => {
  // 내가 찍은 사진들 제공
  if (req.body.id) {
    const images = await Image.find({ "user._id": req.body.id }); // 탐색, 수정, 옵션
    res.json(images);
  }
});

imageRouter.delete("/album/delete", async (req, res) => {
  // 1. uploads 폴더에 있는 사진 데이터를 삭제
  // 2. DB에 있는 image 문서를 삭제
  // console.log(req.body.img.desc);
  // console.log(req.body.img.imageUrl);
  // console.log(req.body.img.key);
  // console.log(req.body.img.owner);
  try {
    if (!req.body.img.owner) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.body.img.desc))
      throw new Error("올바르지 않은 이미지 ID입니다.");
    const image = await Image.findOneAndDelete({ _id: req.body.img.desc });
    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });
    // await fileUnlink(`./uploads/${image.key}`); // path(경로)에 있는 파일을 지울건지, CB
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

// 본인 사진들만 리턴 (public 유무 상관없이)
imageRouter.get("/:id/album", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const images = await Image.find({ "user._id": req.user.id }); // ._id는 쓸 수 없으므로 ""로 묶음 -> Mongo DB가 알아서 파싱해줌
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = imageRouter;
