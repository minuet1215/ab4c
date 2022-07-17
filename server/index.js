const express = require("express");
const app = express();
const port = 5001; // 백엔드 포트 // todo
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const path = require("path");
const env = require('dotenv');


// const cors = require("cors");
// app.use(cors());
const mailController = require("./js/modules/mailSender");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ====================== < DB > ====================== //

process.env.mongoURI
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결"))
  .catch((err) => console.log(err));

// ====================== < bg rm test > ====================== //

// backend 포트로 바로 들어와서 요청해야함
app.use("/js", express.static(__dirname + "/js"));
app.use("/modules", express.static(__dirname + "/modules"));
app.get("/test", (_, res) => {
  console.log("im in test");
  res.sendFile(__dirname + "/html/playground.html");
});

// ====================== < REACT 연결 > ====================== //

// react 로 생성된 파일을 접속하면 index.html을 보여줌
app.use(express.static(path.join(__dirname, "../client/build")));
// 라우트 설정 (react)
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ========================= < API > ========================= //

//boiler-plate
app.get("/api/hello", (_, res) => res.send("landing page check"));

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
    // console.log(req.body.isLocal);
    // console.log(userInfo.loginType);
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

// ------------------------- < socket > ------------------------- //
let http = require("http");
let server = http.createServer(app, {
  cors: { origin: "*" },
});
let socketio = require("socket.io");
let io = socketio.listen(server);

let users = {};

let socketToRoom = {};

const maximum = 2; // 최대 인원수

io.on("connection", (socket) => {
  // console.log("소켓 연결됨");

  socket.on("ping_test", (data) => {
    console.log("ping test socket: ", data);
  }); // test

  socket.on("join_room", (data) => {
    if (users[data.room]) {
      const length = users[data.room].length;
      if (length === maximum) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      users[data.room].push({ id: socket.id });
    } else {
      users[data.room] = [{ id: socket.id }];
    }
    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id
    );

    console.log(usersInThisRoom);

    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (sdp) => {
    console.log("offer: " + socket.id);
    socket.broadcast.emit("getOffer", sdp);
  });

  socket.on("answer", (sdp) => {
    console.log("answer: " + socket.id);
    socket.broadcast.emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate) => {
    console.log("candidate: " + socket.id);
    socket.broadcast.emit("getCandidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.broadcast.to(room).emit("user_exit", { id: socket.id });
    console.log(users);
  });

  socket.on("take_photo", (room_name) => {
    socket.to(room_name).emit("take_photo");
  });
});
// ------------------<invite>---------------------------//
app.use("/invite", mailController);


// ------------------<image save for Local>---------------------------//
const multer = require('multer');
const upload = multer({
  storage : multer.diskStorage({
    destination(req, file ,cb) {
      cb(null, "uploads/"); //cb 콜백함수를 통해 전송된 파일을 'uploads' 폴더에 저장
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일확장자
      cb (
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext); // cb 콜백함수를 통해 전송된 파일 이름 설정(파일명 + 업로드시간 + 확장자)
    }
  })
});

app.get("*", (_, res) => res.send("404 Not Found"));
server.listen(port, () => console.log(`백엔드 서버 실행 (포트번호) ${port}`));
