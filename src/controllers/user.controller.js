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

    const findUser = await UserData.findOne({email:email});

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

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)
    
    const createData = await UserData.create({
      name,
      email,
      password :hashPassword,
      ChangePassword: ChangePassword,
      image: uploadedImage.url,
    });

    const accessToken = jwt.sign({_id:createData._id,email:createData.email},process.env.ACCESSTOKEN,{expiresIn:"1d"})

    const user = await UserData.findById(createData._id).select("-password")

    return res.status(201).json({
      message: "User created successfully",
      user, accessToken
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateUserData = async (req, res) => {
  const id = req.params.id;

  try {
  } catch (error) {}
};

export { uploadData, getData };
