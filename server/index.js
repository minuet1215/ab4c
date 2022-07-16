const express = require("express");
const app = express();
const port = 5001; // 백엔드 포트 // todo
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const path = require("path");
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ====================== < DB > ====================== //

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결"))
  .catch((err) => console.log(err));

// ====================== < direct html routing test > ====================== //

// todo : 리엑트화 (지금은 server side rendering)
// backend 포트로 바로 들어와서 요청해야함
// app.use("/js", express.static(__dirname + "/js"));
// app.use("/modules", express.static(__dirname + "/js/modules"));
// app.get("/test", (_, res) => {
//   console.log("im in test");
//   res.sendFile(__dirname + "/html/playground.html");
// });
// app.get("/noom", (_, res) => {
//   console.log("im in noom");
//   res.sendFile(__dirname + "/html/noom.html");
// });

// ====================== < REACT 연결 > ====================== //

// react 로 생성된 파일을 접속하면 index.html을 보여줌
app.use(express.static(path.join(__dirname, "../client/build")));
// 라우트 설정 (react)
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ========================= < API > ========================= //

//boiler-plate
app.get(
  "/api/hello",
  (_, res) => {}
  // res.send("landing page check")
);

// ------------------------- < users > ------------------------- //
app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
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
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다 ==> Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    // role 0: 일반유저,  role 0이 아니면: 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    // role 1: 어드민, role 2: 특정 부서 어드민
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  // 토큰 삭제
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

// ------------------------- < rooms > ------------------------- //
app.post("/api/rooms/enter", auth, (req, res) => {
  // todo: DB에서 방 번호 찾기 (검증)
  const roomNumber = req.body.roomNumber;
  if (!roomNumber) {
    return res.status(400).json({ success: false, err: "잘못된 요청" });
  } else {
    return res.status(200).json({ success: true, roomNumber: roomNumber });
  }
});

// ========================= < WebRTC > ========================= //
let http = require("http");
let server = http.createServer(app, {
  cors: { origin: "*" },
});
const io = require("socket.io")(server);

// ==================== group call < SOCKET > ==================== //

let currennt_room_name;

io.on("connection", (socket) => {
  socket.on("join_room", (room_name, local_socket_id) => {
    // console.log(`join_room: ( ${room_name} ) ${local_socket_id}`);
    currennt_room_name = room_name;
    socket.join(room_name);
    socket.to(room_name).emit("welcome", local_socket_id);
  });
  socket.on("offer", (offer, local_socket_id, remote_socket_id, index) => {
    // console.log("get offer");
    socket.to(remote_socket_id).emit("offer", offer, local_socket_id, index);
  });
  socket.on("answer", (answer, remote_socket_id, localIndex, remote_index) => {
    // console.log("get answer");
    socket
      .to(remote_socket_id)
      .emit("answer", answer, localIndex, remote_index);
  });
  socket.on("ice", (ice, remote_socket_id, index) => {
    // console.log("get ice candidate");
    socket.to(remote_socket_id).emit("ice", ice, index);
  });

  // leave room
  socket.on("disconnecting", (reason) => {
    // console.log(`disconnecting ( ${currennt_room_name} ): ${reason}`);
    socket.to(currennt_room_name).emit("leave_room", socket.id);
  });
});

app.get("*", (_, res) => res.send("404 Not Found"));
server.listen(port, () => console.log(`백엔드 서버 실행 (포트번호) ${port}`));
