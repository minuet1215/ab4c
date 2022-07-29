const friendsRouter = require("express").Router();
const { User } = require("../models/User");
const { Image } = require("../models/Image");

// 친구 검색 기능
friendsRouter.get("/search/:friendId", async (req, res) => {
  try {
    const friend = User.find({ email: req.params.friendId });
    if (!friend) throw new Error("사용자의 ID를 찾을 수 없습니다.");
    res.status(200).json(friend.name);
  } catch (err) {
    res.json({ err: err.message });
  }
});

// 친구 추가 기능
friendsRouter.post("/add/:friendId", async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const me = await User.find({ "user._id": req.body.id });

    if (me.friends.includes(friendId))
      throw new Error("이미 등록되어 있는 친구입니다.");

    await User.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      { $addToSet: { friends: friendId } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.json({ err: err.message });
  }
});

// 친구 목록에서 제거
friendsRouter.patch("/delete/:friendId", async (req, res) => {
  try {
    const me = await User.findOneAndUpdate(
      { _id: req.body.Id },
      { $pull: { friends: req.params.friendId } }
    );
    //   const friendId =
  } catch (err) {
    res.json({ err: err.message });
  }
});

// 친구 앨범 중 공개된 사진만 가져오기
friendsRouter.get("/showAlbum/:frinedId", async (req, res) => {
  const images = await Image.find({ _id: req.params.id, public: true }).sort({
    createdAt: -1,
  });
  res.json(images);
});

// 나의 친구 리스트
friendsRouter.get("/me/friendsList", async (req, res) => {
  const user = await User.find({ _id: req.body.id });
  res.json(user.friends);
});

module.exports = friendsRouter;
