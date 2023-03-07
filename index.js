const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectDB = require("./database/db");
const cors = require("cors");
const db = require("./models");
const User = db.user;
const Role = db.role;
const app = express();
const secret = "mysecretkey"; // replace with a secure key
app.use(express.json());

const corsOptions = {
  exposedHeaders: "Authorization",
};
app.use(cors(corsOptions));
// Define a route for user login
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the username and password are valid
  const userRole = await Role.findOne({ name: "user" });
  const userUser = await User.findOne({ email: email });
  if (!userUser) {
    // Create the admin user if it doesn't exist
    console.log();
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (!err) {
        const newUser = new User({
          name: name,
          email: email,
          password: hashedPassword,
          role: userRole._id,
        });
        newUser.save();
        console.log("User user created:", newUser);
        const token = jwt.sign({ userId: newUser._id }, secret);
        res
          .set("Authorization", `Bearer ${token}`)
          .send({ message: "Login successful.", token: token });
      } else {
        console.log(err);
      }
    });
  }
  // Generate a JWT token and send it in the response
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the username and password are valid
  const user = await User.findOne({ email: email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: "Invalid username or password." });
  }

  // Generate a JWT token and send it in the response
  const token = jwt.sign({ userId: user._id }, secret);
  res
    .set("Authorization", `Bearer ${token}`)
    .send({ message: "Login successful.", token: token });
});

// Define a route that requires authentication
app.get("/user", authenticate, isUser, (req, res) => {
  const user = req.user;
  const role = req.role;
  res.send({ message: "Protected data. User", user, role });
});
app.get("/admin", authenticate, isAdmin, (req, res) => {
  const user = req.user;
  const role = req.role;
  res.send({ message: "Protected data. Admin", user: user, role: role });
});

// Middleware function to authenticate the user
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized." });
    }
    req.userId = decoded.userId;
    next();
  });
}
async function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  const user = await User.findById(req.userId).then((user) => {
    if (user) {
      const roleId = user.role;
      const role = Role.findById(roleId).then((role) => {
        if (role.name == "asmin") {
          req.user = user;
          req.role = role;
          next();
        } else {
          console.log("not admin");
          return res.status(401).send({ message: "Unauthorized." });
        }
      });
    }
  });
}
async function isUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  const user = await User.findById(req.userId).then((user) => {
    if (user) {
      const roleId = user.role;
      const role = Role.findById(roleId).then((role) => {
        if (role.name == "user") {
          req.user = user;
          req.role = role;
          next();
        } else {
          console.log("not admin");
          return res.status(401).send({ message: "Unauthorized." });
        }
      });
    }
  });
}
connectDB();

app.listen(5000, () => console.log("Server started. http://localhost:5000/"));
