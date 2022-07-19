const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리
  // 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;
  // 토큰을 복호화해서 유저 정보 가져오기
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    // 유저 정보가 없으면 인증 실패
    if (!user) return res.json({ isAuth: false, error: true });
    // 유저 정보가 있으면 인증 성공
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
