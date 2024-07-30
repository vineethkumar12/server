const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Use bcryptjs
const { knex } = require("knex");
const register = require("./register");

// Load environment variables
require("dotenv").config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://vineethkumar12.github.io"], // Allow both origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
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
});

// Check database connection
db.raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database not connected:", err);
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
  register.handleregister(req, res, db);
});

app.get("/", (req, res) => {
  res.send(database);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
