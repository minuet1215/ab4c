const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const jwt = require("jsonwebtoken");

const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    maxlength: 50,
  },
  roomId: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  hostName: {
    type: String,
    maxlength: 50,
  },
  image: String,
  token: String,
  tokenExp: Number,
});

// RoomSchema.pre("save", function (next) {
//   const user = this;
//   // 비밀번호 암호화
//   if (user.isModified("password")) {
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//       if (err) return next(err);
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

// RoomSchema.statics.findByToken = function (token, cb) {
//   let user = this;
//   // 토큰을 복호화해서 유저 정보 가져오기
//   jwt.verify(token, "secretToken", (err, decoded) => {
//     user.findOne({ _id: decoded, token: token }, function (err, user) {
//       if (err) return cb(err);
//       cb(null, user);
//     });
//   });
// };

const Room = mongoose.model("Room", RoomSchema);
module.exports = { Room };
