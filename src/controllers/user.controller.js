import { json } from "express";
import UserData from "../model/user.model.js";
import { imagekit } from "../utils/imagekit.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getData = async (req, res) => {
  const foundUser = await UserData.find();

  if (!foundUser) {
    return res.status(404).json({ message: "user not found" });
  }

  return res.status(201).json({ message: "user found succefully", foundUser });
};

const uploadData = async (req, res) => {
  try {
    const { name, email, password, ChangePassword } = req.body;
    const file = req.file;

    //    console.log("req.body =",req.body)

    if (!name || !email || !password || !ChangePassword) {
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

    if (password !== ChangePassword) {
      return res
        .status(404)
        .json({ message: "password and ChangePassword does not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const createData = await UserData.create({
      name,
      email,
      password: hashPassword,
      ChangePassword: ChangePassword,
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.headers['remote-addr'] ||
      req.socket?.remoteAddress ||
      'unknown';

    const loginAttempt = failedLoginAttemtps.get(ip);

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
  const user = await UserData.findOne({email})

  
  if (!user) {
    return handleFailedAttempt(ip);
  }

  const matchPassword = await bcrypt.compare(password,user.password)

 if (!matchPassword) {
    return handleFailedAttempt(ip, res);
  }

  failedLoginAttempts.delete(ip);

  const accessToken =  jwt.sign({user_id:user._id,email:user.email}, process.env.ACCESSTOKEN,{expiresIn:"1d"})

  const refreshToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.REFRESHTOKEN,
    { expiresIn: "5d" }
  )

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken,{
    httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
  })
  .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
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

function handleFailedAttempt(ip, res) {
  const currentTime = Date.now();
  const attempt = failedLoginAttempts.get(ip) || { attempts: 0, lastAttempt: null };

  attempt.attempts += 1;
  attempt.lastAttempt = currentTime;

  if (attempt.attempts >= 5) {
    attempt.blockedUntil = currentTime + 15 * 60 * 1000; // 15 minutes block
  }

  failedLoginAttempts.set(ip, attempt);

  return res.status(401).json({
    message: "Invalid credentials or user not found.",
  });
}

  } catch (error) {
    console.log(error)
  }
};

export { uploadData, getData ,loginUser};
