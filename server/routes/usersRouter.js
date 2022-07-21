const usersRouter = require("express").Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const axios = require("axios");
const localStorage = require("node-localstorage");

usersRouter.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    console.log(err);
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.status(200).json({ success: true });
    }
  });
});
usersRouter.post("/check", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        isUser: false,
      });
    } else {
      return res.json({
        isUser: true,
      });
    }
  });
});

usersRouter.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    if (userInfo.loginType === "local" && req.body.isLocal) {
      userInfo.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });

        //비밀번호 까지 맞다면 토큰을 생성하기.
        userInfo.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          // 쿠키 (or 로컳스토리지)에 토큰을 저장한다.
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });
    } else if (
      userInfo.loginType === "kakao" &&
      req.body.isLocal === undefined
    ) {
      userInfo.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 쿠키 (or 로컳스토리지)에 토큰을 저장한다.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    } else {
      res.send("<script>alert('로그인 실패')</script>");
    }
  });
});

usersRouter.get("/authen", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다 ==> Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    // role 0: 일반유저,  role 0이 아니면: 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    loginType: req.user.loginType,
    // role 1: 어드민, role 2: 특정 부서 어드민
    role: req.user.role,
    image: req.user.image,
  });
});

usersRouter.get("/logout1", auth, (req, res) => {
  // 토큰 삭제
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.cookie("x_auth", "").status(200).json({ success: true });
  });
});

usersRouter.post("/kakaologout", async (req, res) => {
  const userToken = req.body.token;
  let logout;
  try {
    logout = await axios({
      method: "post",
      url: "https://kapi.kakao.com/v1/user/logout",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = usersRouter;