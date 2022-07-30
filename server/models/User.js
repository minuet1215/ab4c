require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALTROUNDS, SECRET_TOKEN } = process.env;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    trim: true,
    unique: 1,
  },

  password: {
    type: String,
    minlength: 5,
  },

  lastname: {
    type: String,
    maxlength: 50,
  },

  role: {
    type: Number,
    default: 0,
  },
  // following
  friends: [{ type: String }],

<<<<<<< Updated upstream
  profileImage: String,
=======
  // follower
  follower: [{ type: String }],

  profileImage: {
    // by mw
    type: String,
    default:
      "https://i.pinimg.com/280x280_RS/55/96/4e/55964ebb02710d6b9ce1c26f1d857906.jpg",
  },
>>>>>>> Stashed changes
  token: String,
  tokenExp: Number,
  loginType: String,
});

UserSchema.pre("save", function (next) {
  const user = this;
  // 비밀번호 암호화
  if (user.isModified("password")) {
    bcrypt.genSalt(parseInt(SALTROUNDS), function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (plainPassword, cb) {
  // 비밀번호 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateToken = function (cb) {
  const token = jwt.sign(this._id.toHexString(), SECRET_TOKEN);
  this.token = token;
  this.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

UserSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // 토큰을 복호화해서 유저 정보 가져오기
  jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };
