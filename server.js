const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Updated import
const knex = require("knex");
const register = require("./register");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["https://vineethkumar12.github.io", "http://localhost:3000"],
  })
);

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 2,
    max: 10,
  },
});

db.raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database not connected:", err.message);
    process.exit(1);
  });

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "password")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length > 0) {
        const hash = data[0].password;
        bcrypt.compare(password, hash, (err, result) => {
          if (result) {
            db.select("*")
              .from("users")
              .where("email", "=", email)
              .then((user) => {
                res.json(user[0]);
              })
              .catch((err) => res.status(400).json(err));
          } else {
            res.status(400).json("Invalid email or password");
          }
        });
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/register", (req, res) => {
  register.handleregister(req, res, db);
});

app.get("/", (req, res) => {
  res.send({ message: "Server is running!" });
});

const serverless = require("serverless-http");

module.exports = app;
module.exports.handler = serverless(app);
