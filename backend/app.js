const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http");
const cors = require("cors");
const parseUrl = require("body-parser");
const app = express();
const { v4: uuidv4 } = require("uuid");

const mysql = require("mysql");
const bcrypt = require("bcrypt");

let encodeUrl = parseUrl.urlencoded({ extended: false });

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());
app.use(express.text());
// Middleware for sessions
app.use(
  session({
    secret: "my-secret-key",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

app.use(cookieParser());

// Creating connection to the mysql db
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass",
  database: "lindsey",
});

con.connect(function (err) {
  if (err) {
    console.log(err);
  }
});

// Route for logging out
app.get("/logout", (req, res, next) => {
  // Destroy the session and redirect to the login page
  req.session.destroy(() => {
    res.status(200).json({ message: "User successfully logged out" });
  });
});

// Route for logging the user/provider into the system
app.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // checking if user/provier is registered or not
  con.query(`SELECT * FROM users WHERE email = '${email}'`,
    async function (err, result) {
      if (err) {
        console.log(err);
      }
      if (Object.keys(result).length > 0) {
        let passwordMatch = await bcrypt.compare(password, result[0].password);

        if (!passwordMatch) {
          // Passwords do not match
          return res.status(401).json({
            message:
              "Inavlid credentials. Password doesn't match for the provided email",
          });
        } else {
          req.session.user = {
            accountID: result[0].id,
            name: result[0].name,
            email: result[0].email,
            phoneNumber: result[0].phoneNumber,
            role: "User",
          };
          res.status(200).json({
            message: "User successfully logged in",
            resp: req.session.user,
          });
        }
      } else {
        res
          .status(404)
          .json({ message: "User doesn't exists. Try signing up instead" });
      }
    }
  );
});

// Route for registering either a user or provider into the system
app.post("/register", encodeUrl, (req, res, next) => {
  const { name, email, phoneNumber, role, password, date } = req.body;

  con.query(`SELECT * FROM users WHERE email = '${email}'`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (Object.keys(result).length > 0) {
        res
          .status(403)
          .json({ message: "User already exists. Try logging in instead" });
      } else {
        req.session.user = {
          accountID: uuidv4(),
          name,
          email,
          phoneNumber,
          role: role,
        };

        const saltRounds = 10;
        const plainPassword = password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
          con.query(`INSERT INTO users (id, name, email, phoneNumber, password, dob, role_type) VALUES ('${uuidv4()}', '${name}', '${email}', '${phoneNumber}', '${hash}', '${date}', 'User')`,
            function (err, result) {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {
                res.status(200).json({
                  message: `Successfully registered user`,
                  resp: req.session.user,
                });
              }
            }
          );
        });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
