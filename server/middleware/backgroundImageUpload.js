require("dotenv").config();
const { AWS_BUCKET_NAME } = process.env;
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const { s3 } = require("../data/aws");
const multerS3 = require("multer-s3");

const storage = multerS3({
  s3,
  bucket: AWS_BUCKET_NAME,
  key: (req, file, cb) =>
    cb(null, `backgroundImages/${uuid()}.${mime.extension(file.mimetype)}`),
});

const backgroundUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("invalid file type"), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 업로드 할 수 있는 최대 파일 크기 10MB
  },
});

module.exports = { backgroundUpload };
