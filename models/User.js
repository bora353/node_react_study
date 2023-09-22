const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 10자리인 salt 만들기
const jwt = require("jsonwebtoken");

// 스키마
const userSchema = mongoose.Schema({
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
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// save 하기 전에 이 코드를 수행함
userSchema.pre("save", function (next) {
  var user = this; // this는 userSchema 의미함

  if (user.isModified("password")) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // user.password는 순수한 비밀번호이고 hash는 암호화된 비밀번호
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// userSchema.methods.comparePassword = async function (plainPassword, callback) {
//   // plainPassword 1234567 이런 것      암호화된 비밀번호 $2b$10$Xb7EmVy3kQa7Q7z59qMhwOrYPPTleu9waL5tZ2YKTA5IzD7QtMjki
//   bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//     // this.password는 암호화된 패스워드
//     if (err) {
//       return callback(err);
//     }
//     // 같다면 null을 전달해주고 isMatch가 true
//     callback(null, isMatch);
//   });
// };

userSchema.methods.comparePassword = async function (plainPassword) {
  try {
    // plainPassword 1234567 이런 것     this.password는 암호화된 패스워드
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

// userSchema.methods.generateToken = function (callback) {
//   var user = this;

//   // jsonwebtoken을 이용해서 token을 생성하기
//   var token = jwt.sign(user._id.toHexString(), "secretToken");

//   user.token = token;
//   user.save(function (err, user) {
//     if (err) return callback(err);
//     // 에러 없으면
//     callback(null, user);
//   });
// };

userSchema.methods.generateToken = async function () {
  const user = this;

  // jsonwebtoken을 이용해서 token을 생성하기
  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;

  try {
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

// userSchema.statics.findByToken = function (token, callback) {
//   try {
//     const user = this;

//     // 토큰 decode
//     jwt.verify(token, "secretToken", function (err, decoded) {
//       // 유저 아이디를 이용해서 유저를 찾은 다음에
//       // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

//       user.findOne(
//         {
//           _id: decoded,
//           token: token,
//         },
//         function (err, user) {
//           if (err) return callback(err);
//           callback(null, user);
//         }
//       );
//     });
//   } catch {}
// };

userSchema.statics.findByToken = async function (token) {
  const user = this;

  try {
    // 토큰 decode
    const decoded = jwt.verify(token, "secretToken");

    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    const foundUser = await user.findOne({
      _id: decoded,
      token: token,
    });

    return foundUser;
  } catch (err) {
    throw err;
  }
};

// 스키마를 모델로 감싸주기
// mongoDB에 users 테이블 생성됨
const User = mongoose.model("User", userSchema);

// 모델을 다른 파일에서도 사용할 수 있게 export
module.exports = { User };
