const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully ✅",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration Failed ❌",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

// Check if user exists
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({
    message: "User not found ❌",
  });
}
// Compare entered password with hashed password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid Password ❌",
  });
}
// Generate JWT Token
const token = jwt.sign(
  {
    id: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);
// Login Successful
res.status(200).json({
  message: "Login Successful ✅",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (error) {
    res.status(500).json({
      message: "Login Failed ❌",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};