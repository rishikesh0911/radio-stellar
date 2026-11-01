const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Valid name, email and password are required"
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({
    email: normalizedEmail
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email already registered"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword
  });

  res.status(201).json({
    success: true,
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: (email || "").toLowerCase().trim()
  }).select("+password");

  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  res.json({
    success: true,
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};