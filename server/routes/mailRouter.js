const mailRouter = require("express").Router();
const nodemailer = require("nodemailer");
// const senderInfo = require("../config/senderInfo.json");

mailRouter.post("/", function (req, res, next) {
  let to_email = req.body.email;
  let to_nickname = req.body.nickname;
  let roomHost = req.body.host;
  let participationCode = req.body.code;

  const title = `[안방네컷] ${roomHost}님이 회원님을 초대하셨습니다.`;

  // 발송자 정보 (안방네컷)
  const senderAccount = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS 를 사용하지 않으면 false, 아니면 true
    auth: {
      user: senderInfo.user,
      pass: senderInfo.pass,
    },
  };

  // 메일 내용
  const content = {
    from: `${senderInfo.user}`,
    to: `${to_email}`,
    subject: `${title}`,
    html: `<h2>${to_nickname} 님, 안녕하세요.</h2> <br/>
    ${roomHost}님이 초대하셨어요<br/>해당 링크로 사진관에 접속하세요 <a href="https://www.naver.com/}">접속하기</a>`,
  };

  const send = async (data) => {
    nodemailer
      .createTransport(senderAccount)
      .sendMail(data, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("발송 성공");
          return info.response;
        }
      });
  };
  send(content);
  res.redirect("/");
});

module.exports = mailRouter;
