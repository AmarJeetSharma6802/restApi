import { json } from "express";
import UserData from "../model/user.model.js";
import { imagekit } from "../utils/imagekit.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

const getData = async (req, res) => {
  const foundUser = await UserData.find();

  if (!foundUser.length) {
    return res.status(404).json({ message: "No users found" });
  }

  return res.status(201).json({ message: "user found succefully", foundUser });
};

const uploadData = async (req, res) => {
  try {
    const { name, email, password, comparePassword } = req.body;
    const file = req.file;

    //    console.log("req.body =",req.body)

    if (!name || !email || !password || !comparePassword) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (!file) {
      return res.status(400).json({ message: "image required" });
    }

    const findUser = await UserData.findOne({ email: email });

    if (findUser) {
      return res.status(401).json({
        message: "User already exists",
      });
    }

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    if (password !== comparePassword) {
      return res
        .status(404)
        .json({ message: "password and comparePassword do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const createData = await UserData.create({
      name,
      email,
      password: hashPassword,
      image: uploadedImage.url,
    });

    const accessToken = jwt.sign(
      { _id: createData._id, email: createData.email },
      process.env.ACCESSTOKEN,
      { expiresIn: "1d" }
    );

    const user = await UserData.findById(createData._id).select("-password");

    return res.status(201).json({
      message: "User created successfully",
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const failedLoginAttempts = new Map();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.headers["remote-addr"] ||
      req.socket?.remoteAddress ||
      "unknown";

    const loginAttempt = failedLoginAttempts.get(ip);

    if (loginAttempt?.blockedUntil && Date.now() < loginAttempt.blockedUntil) {
      const remainingTime = Math.ceil(
        (loginAttempt.blockedUntil - Date.now()) / (1000 * 60)
      );
      return res.status(429).json({
        message: `Too many failed attempts. Try again in ${remainingTime} min.`,
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await UserData.findOne({ email });

    if (!user) {
      return handleFailedAttempt(ip, res);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return handleFailedAttempt(ip, res);
    }

    failedLoginAttempts.delete(ip);

    const accessToken = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.ACCESSTOKEN,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.REFRESHTOKEN,
      { expiresIn: "5d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { name: user.name, email: user.email },
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

function handleFailedAttempt(ip, res) {
  const currentTime = Date.now();
  const attempt = failedLoginAttempts.get(ip) || {
    attempts: 0,
    lastAttempt: null,
  };

  attempt.attempts += 1;
  attempt.lastAttempt = currentTime;

  if (attempt.attempts >= 5) {
    attempt.blockedUntil = currentTime + 15 * 60 * 1000;
  }

  failedLoginAttempts.set(ip, attempt);

  return res.status(401).json({
    message: "Invalid credentials or user not found.",
  });
}

const deleteAccount = async (req, res) => {
  const id = req.params.id;

  try {
    const foundUser = await UserData.findByIdAndDelete(id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Account deleted successfully", foundUser });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UserloggedOut = async (req, res) => {
  await UserData.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
  });

  return res
    .status(201)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json({ message: "User logged out" });
};

const updateAccount = async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!file) {
    return res.status(400).json({ message: "image is required" });
  }

  const uploadedImage = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
  });

  const user = await UserData.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      image: uploadedImage.url,
    },
    { new: true, select: "-password -refreshToken -__v" }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    message: "Account updated successfully",
    user: user,
  });
};

const userChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required." });
  }

  const user = await UserData.findById(req.user?._id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Old password does not match" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({ message: "Password changed successfully" });
};

const findUserById = async (req, res) => {
  const id = req.params.id;

  const findById = await UserData.findById(id);

  if (!findById) {
    return res.status(404).json({ message: "user id not found" });
  }

  res.status(201).json({ message: "user find by id succesully", findById });
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.headers("authorization")?.replace("Bearer ", "");

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN);

  const user = await UserData.findById(decoded.user_id);

  if (!user || user.refreshToken !== refreshToken) {
    return res.json({ message: "Invalid refresh token" }).status(401);
  }

  const NewaccessToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.ACCESSTOKEN,
    { expiresIn: "1d" }
  );

  res.cookie("accessToken", NewaccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
      message: "New access token generated",
      NewaccessToken,
    });
};



export {
  uploadData,
  getData,
  loginUser,
  deleteAccount,
  UserloggedOut,
  updateAccount,
  userChangePassword,
  findUserById,
  refreshToken,
};
