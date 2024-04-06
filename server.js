const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { knex } = require("knex");
const register = require("./register");

// Load environment variables
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://vineethkumar12.github.io",
    credentials: true,
  })
);

const db = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "password")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length > 0) {
        const hash = data[0].password;
        bcrypt.compare(password, hash, function (err, result) {
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
  // Implement registration logic here
});

app.get("/", (req, res) => {
  res.send(database.users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
