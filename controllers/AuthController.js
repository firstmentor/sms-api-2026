const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {

  // REGISTER (ADMIN / STUDENT)
  static register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // LOGIN (ADMIN + STUDENT)
  static login = async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email });
      // console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      // console.log(isMatch)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      // console.log(token)

      // ✅ HTTP-ONLY COOKIE
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });


    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // LOGOUT
  static logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  };


  static changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      // console.log(req.body)
      const userId = req.user.id; // token se aa raha hai
      // console.log(userId)
      // 1️⃣ User find karo
      const user = await User.findById(userId);
      // console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 2️⃣ Old password check
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password incorrect" });
      }

      // 3️⃣ New password hash
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 4️⃣ Password update
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password changed successfully"
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = AuthController;
