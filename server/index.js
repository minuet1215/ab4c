require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

/* Router */
const usersRouter = require("./routes/usersRouter");
const mailRouter = require("./routes/mailRouter");
const imageRouter = require("./routes/imageRouter");
const roomsRouter = require("./routes/roomsRouter");

/* Config */
const { PORT } = process.env;

/* Middleware*/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/* DB 연결 */
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결"))
  .catch((err) => console.log(err));

// ====================== < REACT 연결 > ====================== //

// react 로 생성된 파일을 접속하면 index.html을 보여줌
app.use(express.static(path.join(__dirname, "../client/build")));
// 라우트 설정 (react)
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ========================= < API Router > ========================= //

app.use("/api/users", usersRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/image", imageRouter);
app.use("/invite", mailRouter);

// ========================= < WebRTC > ========================= //
let http = require("http");
let server = http.createServer(app, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
const io = require("socket.io")(server);

// ==================== group call < SOCKET > ==================== //

let users = {};
let socketToRoom = {};
const maximum = 2;

io.on("connection", (socket) => {
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
    socket.broadcast.emit("user_exit", { id: socket.id });
    console.log(users);
  });
});

// ------------------<image save for Local>---------------------------//

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/"); //cb 콜백함수를 통해 전송된 파일을 'uploads' 폴더에 저장
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일확장자
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      ); // cb 콜백함수를 통해 전송된 파일 이름 설정(파일명 + 업로드시간 + 확장자)
    },
  }),
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(PORT, () => console.log(`백엔드 서버 실행 (포트번호) ${PORT}`));
