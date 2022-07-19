const route = require("express").Router();

// todo: auth middleware 추가 필요
// const { auth } = require("../middleware/auth");

const { upload } = require("../utils/file");

route.post("/upload", (req, res) => {
  upload.single("user-file")(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = route;
