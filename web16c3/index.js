let express = require("express");
let app = express();
let fs = require("fs");
const crypto = require("crypto");
let PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/user/create", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    console.log(req.body);
    console.log(parsed);
    parsed.users = [...parsed.users, req.body];
    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.status(201).send("Product created");
    });
  });
});

app.post("/user/login", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    console.log(parsed);
    console.log(req.body);

    if (!req.body.login || !req.body.password) {
      res.status(401).send({ status: "please provide username and password" });
    } else {
      parsed.users.map((el) => {
        if (el.login == req.body.login && el.password === req.body.password) {
          let token = crypto.randomUUID();
          parsed.users = [
            ...parsed.users,
            { ...el, [el.token]: token, [el.id]: token },
          ];

          fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
            res.status(201).send("token added");
          });
          res.status(400).send({ status: "Login Successful", token });
        }
      });
    }
  });
});
app.delete("/user/logout/:id", (req, res) => {
  let { id } = req.params;
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);

    parsed.users = parsed.users.filter((el) => el.id !== id);

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      resizeBy.send({ status: "user logged out successfully" });
    });
  });
});

app.get("/user", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    res.json(JSON.parse(data));
  });
});

// app.use((req, res, next) => {
//   if (!req.login["token"]) {
//     return res.status(401).send("user not authenticated");
//   } else {
//     res.status();
//   }
//   next();
// });

app.listen(PORT, () => {
  console.log("runing server on port:8080");
});
