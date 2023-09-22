const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gaeunLee:rkdms0811!@nodereact.jluq1nv.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    }
  )
  .then(() => console.log("몽고DB connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world~~"));

app.listen(port, () => console.log(`포트 연결 중.. ${port}!`));
