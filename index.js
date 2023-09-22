const express = require("express");
const app = express();
const port = 3000;

const { User } = require("./models/User");

// 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게
const bodyParser = require("body-parser");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");

const config = require("./config/key");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
  })
  .then(() => console.log("몽고DB connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world~~"));

// app.post("/register", (req, res) => {
//   // 회원가입 할때 필요한 정보들을 client에서 가져와서
//   // 데이터에 넣어준다

//   const user = new User(req.body);

//   // save는 몽고DB 메서드
//   user.save((err, doc) => {
//     if (err) {
//       return res.json({ success: false, err });
//     }
//     return res.status(200).json({
//       success: true,
//     });
//   });
// });

app.post("/register", async (req, res) => {
  // 회원가입 할때 필요한 정보들을 client에서 가져와서
  // 데이터에 넣어준다

  const user = new User(req.body);

  try {
    // save 메서드를 프로미스로 대체하여 사용
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.listen(port, () => console.log(`포트 연결 중.. ${port}!`));
