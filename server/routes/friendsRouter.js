const friendsRouter = require("express").Router();
const { User } = require("../models/User");
const Image = require("../models/Image");
const mongoose = require("mongoose");

// 친구 검색 기능
// 분기 나눠서 json 나눠주기
friendsRouter.get("/search/:friendId", async (req, res) => {
  try {
    const friend = await User.findOne({ email: req.params.friendId });

    const info = {
      name: friend.name,
    };
    res.status(200).json(info);
  } catch (err) {
    res.json({ err: err.message });
  }
});

// 친구 추가 기능
friendsRouter.post("/add/:friendId", async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const me = await User.findOne({ _id: req.body.id });

    if (me.friends.includes(friendId)) {
      res.status(200).json({ success: false });
    } else {
      await User.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        { $addToSet: { friends: friendId } }
      );
      res.status(200).json({ success: true });
    }
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
friendsRouter.get("/showAlbum/:friendId", async (req, res) => {
  const targetFriend = await User.findOne({ email: req.params.friendId });
  const images = await Image.find({
    "user._id": targetFriend.id,
    public: true,
  }).sort({
    createdAt: -1,
  });
  res.json(images);
});

// 나의 친구 리스트
friendsRouter.get("/me/friendsList/:myId", async (req, res) => {
  const me = await User.findOne({ _id: req.params.myId });
  let friendsList = [];
  Promise.all(
    me.friends.map(async (item) => {
      const friend = await User.findOne({ email: item });
      const body = {
        name: friend.name,
        email: friend.email,
        profileImage: friend.profileImage,
      };
      friendsList.push(body);
    })
  ).then((response) => {
    res.status(200).json(friendsList.sort());
  });
});

// 팔로워 수 가져오기

// 팔로잉 수 가져오기

module.exports = friendsRouter;
