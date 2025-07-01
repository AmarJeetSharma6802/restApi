import UserData from "../model/user.model.js";
import jwt from "jsonwebtoken";

export async function authUser(req, res,next) {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers("authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(404).json({ message: "Unauthorized Token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN);

    if (!decoded) {
      return res.status(404).json({ message: "Unauthorized Decoded Token" });
    }

    const user = await UserData.findById(decoded.user_id).select(
      "-password -refreshToken -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "auth user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "auth Internal Server Error" });
  }
}
