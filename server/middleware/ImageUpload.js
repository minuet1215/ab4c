const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const { s3 } = require("../data/aws");
const multerS3 = require("multer-s3");
const Image = require("../models/Image");
const mongoose = require("mongoose");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) =>
//     cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
// });
const userEmail = "";

const storage = multerS3({
  s3,
  bucket: "ab4c-image-bucket",
  key: (req, file, cb) =>
    cb(null, `images/${uuid()}.${mime.extension(file.mimetype)}`),
});

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "ab4c-image-bucket",
//     key: function (req, file, cb) {
//       let ext = file.mimetype.split("/")[1];
//       if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
//         return cb(new Error("Only images are allowed"));
//       }
//       cb(null, Date.now() + "." + file.originalname.split(".").pop());
//     },
//   }),
//   acl: "public-read-write",
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype))
      cb(null, true); // [] 안의 파일만 저장
    else cb(new Error("invalid file type"), false); // 다른 확장자는 저장 안함
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 업로드 할 수 있는 최대 파일 크기 10MB
  },
}); // 이미지 업로드 경로

module.exports = { upload };
