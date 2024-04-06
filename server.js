const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

const bcrypt = require("bcrypt");
const { knex } = require("knex");
const register = require("./register");

// Load environment variablesjj
require("dotenv").config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "vinni@123#",
    database: process.env.DB_NAME || "facedatabase",
  },
});

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "vineeth",
      email: "adepuvineethkumarvinni@gmail.com",
      password: "vineeth",
      entries: "0",
      joined: new Date(),
    },
    {
      id: "124",
      name: "vinay",
      email: "vinay@gmail.com",
      password: "vinay",
      entries: "0",
      joined: new Date(),
    },
  ],
  login: [{ id: "987", hash: "", email: "adepuvineethkumarvinni@gmail.com" }],
};

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "password")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length > 0 && data[0].password === password) {
        db.select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
            res.send("success");
          })
          .catch((err) => res.status(400).json(err));
      } else {
        res.status(400).json("invalid user");
      }
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/register", (req, res) => {
  register.handleregister(req, res, db);
});

app.get("/", (req, res) => {
  res.send(database.users);
});

app.listen(3000, () => console.log("server is running"));
