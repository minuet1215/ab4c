require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

/* Router */
const usersRouter = require("./routes/usersRouter");
const imageRouter = require("./routes/imageRouter");
const roomsRouter = require("./routes/roomsRouter");
const friendsRouter = require("./routes/friendsRouter");
const backgroundImageRouter = require("./routes/backgroundImageRouter");

/* Config */
const { PORT, mongoURI } = process.env;

/* Middleware*/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

/* DB 연결 */
const mongoose = require("mongoose");
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결"))
  .catch();

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
app.use("/api/images", imageRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/bg", backgroundImageRouter);

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

    const usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id
    );

    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (sdp) => {
    socket.broadcast.emit("getOffer", sdp);
  });

  socket.on("answer", (sdp) => {
    socket.broadcast.emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("getCandidate", candidate);
  });
  socket.on("start", (roomname) => {
    socket.broadcast.to(roomname).emit("start");
  });
  socket.on("backgroundChange", (img, roomname) => {
    socket.broadcast.to(roomname).emit("backgroundChange", img);
  });
  socket.on("starChange", (img, roomname) => {
    console.log(img, roomname);
    socket.broadcast.to(roomname).emit("starChange", img);
  });
  socket.on("starLocate", (text, roomname) => {
    socket.broadcast.to(roomname).emit("starLocate", text);
  });
  socket.on("checkRatio", (bool, roomname) => {
    socket.broadcast.to(roomname).emit("checkRatio", bool); //나를 제외한 상대방에게 메시지보내기
  });

  socket.on("disconnect", () => {
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
  });
});

/* =========== Socket End =============*/

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(PORT, () => console.log(`백엔드 서버 실행 (포트번호) ${PORT}`));
