const express = require("express");
const app = express();
const port = 5001; // 백엔드 포트 // todo
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");

const path = require("path");
// const env = require("dotenv");
const multer = require("multer");
const mailController = require("./js/modules/mailSender");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/* ========================= S3 ========================*/
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESSKEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESSKEY,
  region: config.AWS_REGION,
});

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ab4c-image-bucket",
    key: function (req, file, cb) {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, Date.now() + "." + file.originalname.split(".").pop());
    },
  }),
  acl: "public-read-write",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드 요청
app.post("/api/test/img", imageUpload.single("file"), async (req, res) => {
  res.status(200).json({ location: req.file.location });
});

/* =================== S3 End ================*/

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

// ========================= < API > ========================= //

//boiler-plate
// app.get("/api/hello", (_, res) => res.send("landing page check")); // test

// ------------------------- < users > ------------------------- //

const users_route = require("./routes/users");
app.use("/api/users", users_route);

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
// ------------------------- < image local save > ------------------------- //

const image_route = require("./routes/image");
app.use("/api/image", image_route);

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
// ------------------<invite>---------------------------//
app.use("/invite", mailController);

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
server.listen(port, () => console.log(`백엔드 서버 실행 (포트번호) ${port}`));
