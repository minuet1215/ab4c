const roomsRouter = require("express").Router();
const { auth } = require("../middleware/auth");

roomsRouter.post("/enter", auth, (req, res) => {
  // todo: DB에서 방 번호 찾기 (검증)
  const roomNumber = req.body.roomNumber;
  if (!roomNumber) {
    return res.status(400).json({ success: false, err: "잘못된 요청" });
  } else {
    return res.status(200).json({ success: true, roomNumber: roomNumber });
  }
});

module.exports = roomsRouter;
