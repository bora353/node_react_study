const { User } = require("../models/User");

// let auth = (req, res, next) => {
//   // 인증 처리를 하는 곳

//   // 클라이언트에서 쿠키에서 토큰을 가져온다
//   let token = req.cookies.x_auth;

//   // 토큰을 복호화 후 유저를 찾는다
//   User.findByToken(token, (err, user) => {
//     if (err) throw err;
//     if (!user) return res.json({ isAuth: false, error: true });

//     // user가 있는 경우
//     req.token = token;
//     req.user = user;
//     next(); // next 해야 다음으로 넘어갈 수 있게
//   });

//   // 유저가 있으면 인증 Okay

//   // 유저가 없으면 인증 No!
// };

// 인증 처리 하는 곳
// 유저 있으면 인증 OK, 유저 없으면 인증 No
let auth = async (req, res, next) => {
  try {
    // 클라이언트에서 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    // 토큰을 복호화 후 유저를 찾는다
    const user = await User.findByToken(token);

    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    // user가 있는 경우
    req.token = token;
    req.user = user;
    next(); // next 해야 다음으로 넘어갈 수 있게
  } catch (err) {
    console.error(err);
    //res.status(500).json({ isAuth: false, error: true, message: "인증 에러" });
  }
};

module.exports = { auth };
