const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const URL =
  "mongodb+srv://fzroud:fzroud123@nodeapi.p5jxztn.mongodb.net/auth-admin-user-autre";
mongoose.set("strictQuery", false);
const db = require("../models");
const Role = db.role;
const User = db.user;
const connectDB = async () => {
  try {
    await db.mongoose
      .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("Connected to MongoDb seccesfully");
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
          // Create the admin role if it doesn't exist
          const newAdminRole = new Role({
            name: "admin",
            description: "Administrator role",
          });
          await newAdminRole.save();
          console.log("Admin role created:", newAdminRole);
        }
        const userRole = await Role.findOne({ name: "user" });
        if (!userRole) {
          // Create the admin role if it doesn't exist
          const newUserRole = new Role({
            name: "user",
            description: "User role",
          });
          await newUserRole.save();
          console.log("User role created:", newUserRole);
        }
        const password = "password123";
        const adminUser = await User.findOne({ email: "admin@example.com" });
        if (!adminUser) {
          // Create the admin user if it doesn't exist
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (!err) {
              const newAdminUser = new User({
                name: "Admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: adminRole._id,
              });
              newAdminUser.save();
              console.log("Admin user created:", newAdminUser);
            }
          });
        }
        const userUser = await User.findOne({ email: "user@example.com" });
        if (!userUser) {
          // Create the admin user if it doesn't exist
          console.log();
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (!err) {
              const newUser = new User({
                name: "User",
                email: "user@example.com",
                password: hashedPassword,
                role: userRole._id,
              });
              newUser.save();
              console.log("User user created:", newUser);
            }
          });
        }
      });
  } catch (error) {
    console.log(`could not connect to db ${error}`);
    process.exit();
  }
};
const initial = () => {
  Role.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
      await Role.create({
        name: "user",
        description: "role user",
      });
      awaitRole
        .create({
          name: "admin",
          description: "role admin",
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports = connectDB;
