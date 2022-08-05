const usersRouter = require("express").Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const axios = require("axios");
// 회원가입 
usersRouter.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.status(200).json({ success: true });
    }
  });
});
// 회원체크
usersRouter.post("/check", (req, res) => {
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (userInfo) {
      return res.json({isUser: true});
    } else {
      return res.json({isUser: false});
    }
  });
});
/* 로그인 
 * 1. 요청된 이메일이 데이터베이스에서 있는지 찾는다.
 * 2. 로그인 방식에 따라 처리
 *   2-1. 자체 로그인일 경우 비밀번호가 일치하는지 확인
 *   2-2. 카카오 로그인일 경우는 pass
 * 3. 토큰 생성 및 쿠키에 저장 (x_auth)
*/
usersRouter.post("/login", async (req, res) => {
  let userInfo = await User.findOne({ email: req.body.email }); // 1
  if (!userInfo)
    return res.json({
      loginSuccess: false,
      message: "제공된 이메일에 해당하는 유저가 없습니다.",
    });

  if (userInfo.loginType === "local" && req.body.isLocal) { //2
    await userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      userInfo.generateToken((err, user) => {  // 3
        if (err) return res.status(400).send(err);
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id, token: user.token });
      });
    });
  } else if (userInfo.loginType === "kakao" && !req.body.isLocal) {
    await userInfo.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id, token: user.token });
    });
  } else {
    res.json({ loginSuccess: false, message: "잘못된 요청입니다." });
  }
});

// 인증
usersRouter.get("/authen", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다 ==> Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    loginType: req.user.loginType,  
    image: req.user.image,
    isAuth: true,
  });
});

// 로그아웃
usersRouter.get("/logout1", auth, (req, res) => {
  // DB 토큰 초기화
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    // return res.cookie("x_auth", "").status(200).json({ success: true });
    return res.clearCookie("x_auth").status(200).json({success : true});
  });
});

// 카카오 로그아웃
usersRouter.post("/kakaologout", async (req, res) => {
  const userToken = req.body.token;
  try {
    await axios({
      method: "post",
      url: "https://kapi.kakao.com/v1/user/logout",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

// 카카오 프로필 이미지 업데이트
usersRouter.patch("/updateImg", async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.body.email },
    { profileImage: req.body.profileImage }
  );
  res.status(200).json({ success: true });
});

module.exports = usersRouter;
