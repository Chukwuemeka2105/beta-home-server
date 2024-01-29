const PROFILE = require("../models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const userExist = await PROFILE.findOne({ email });
    if (userExist) {
      return res.status(400).json({ err: "The email is already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await PROFILE.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// login account
const handleLogin = async (req, res) => {
  // res.send("Log in Profile");
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ err: "Please Fill all fields" });
    }

    const user = await PROFILE.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ err: "Invalid email or password" });
    }

    //   generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = { handleRegister, handleLogin };
