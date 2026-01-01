import expres from "express";
import realForm from "../model/production.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../utils/nodemailer.js";

// const auth = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(404).json({ message: " all fields reuired" });
//   }

//   let user = await realForm.findOne({ email });

//   if (!user) {
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     const verificationToken = crypto.randomBytes(32).toString("hex");

//     const verificationTokenExpires = Date.now() + 3600000;

//     user = await realForm.create({
//       name,
//       email,
//       password: hashPassword,
//       verificationToken,
//       verificationTokenExpires,
//     });

//     const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&id=${user._id}`;

//     try {
//   await transporter.sendMail({
//     from: `"My App" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>
//            <p>Note: Link expires in 1 hour.</p>`,
//   });
// } catch (error) {
//   console.error("Email not sent:", error);
// }

//     return res.status(201).json({
//       message: "Registration successful. Check your email to verify.",
//     });
//   }

// //    Login if user exists

//   if (!user.isisVerified) {
//     return res.status(400).json({ message: "Email not verified" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (isMatch) {
//     const accessToken = jwt.sign(
//       { user_id: user._id, user_eamil: user.email },
//       process.env.ACCESSTOKEN,
//       { expiresIn: "15m" }
//     );

//     const refreshToken = jwt.sign(
//       { user_id: user._id },
//       process.env.REFRESHTOKEN,
//       { expiresIn: "7d" }
//     );

//     user.refreshToken = refreshToken;
//     await user.save();

//     return res
//       .cookie("accessToken", accessToken, { httpOnly: true })
//       .cookie("refreshToken", refreshToken, { httpOnly: true })
//       .json({ message: "Login successful", refreshToken, user });
//   }

//   //  Forgot password if password wrong

//   const resetToken = crypto.randomBytes(32).toString("hex");
//   user.resetPasswordToken = resetToken;

//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
//   await user.save();

//   const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Reset your password",
//     html: `<p>You tried logging in but your password was incorrect.</p>
//              <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
//              <p>Note: Link expires in 15 min.</p>`,
//   });

//   res.status(400).json({
//     message: "Password incorrect. Reset link sent to your email.",
//   });
// };

const UserData = async (req, res) => {
  const foundUser = await realForm.find();

  if (!foundUser) {
    return res.status(404).json({ message: "user not found", UserData });
  }
  return res.status(200).json({ message: "user is found succefully",foundUser });
};

const auth = async (req, res) => {

  const { name, email, password ,action } = req.body;

 
  if (action === "register") {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    

    let existing = await realForm.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 3600000;

    const user = await realForm.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires,
    });

    const verifyLink = `${process.env.CLIENT_URL}/verifyEmail?token=${verificationToken}&id=${user._id}`;

    try {
      await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>
               <p>Note: Link expires in 1 hour.</p>`,
      });
    } catch (error) {
      console.error("Email not sent:", error);
      return res
        .status(500)
        .json({ message: "Verification email could not be sent" });
    }

    return res.status(201).json({
      message: "Registration successful. Check your email to verify.",
    });
  }

 if (action === "forgot") {

    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await realForm.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user._id}`;

    try {
      await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
               <p>Link expires in 15 min</p>
               <p>Or use this code: <strong>${resetToken}</strong></p>`,
      });
    } catch (err) {
      console.error("Reset email not sent:", err);
      return res
        .status(500)
        .json({ message: "Reset password email could not be sent" });
    }

    return res.status(200).json({ message: "Reset link sent to your email" });
  }

  if (action === "login") {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const user = await realForm.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const accessToken = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.ACCESSTOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.REFRESHTOKEN,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(200)
      .json({ message: "Login successful", user });
  }
    
};

const verifyEmail = async (req, res) => {
  try {
    const { token, id } = req.query;
    const user = await realForm.findById(id);

    if (!user) return res.status(400).send("Invalid link");

    if (user.verificationToken !== token)
      return res.status(400).send("Invalid token");

    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).send("Verification link expired");
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.send("Email verified successfully. You can now login.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email required" });

//   const user = await realForm.findOne({ email });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const resetToken = crypto.randomBytes(32).toString("hex");
//   user.resetPasswordToken = resetToken;
//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
//   await user.save();

//   const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user._id}`;

//   try {
//     await transporter.sendMail({
//       from: `"My App" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset your password",
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
//              <p>Link expires in 15 min</p>
//               <p>Or use this code: <strong>${resetToken}</strong></p>,
//              `,
             
//     });
//   } catch (err) {
//     console.error("Reset email not sent:", err);
//     return res.status(500).json({ message: "Reset password email could not be sent" });
//   }

//   res.status(200).json({ message: "Reset link sent to your email" });
// };


const resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;

  const user = await realForm.findById(id);

  if (
    user.resetPasswordToken !== token ||
    user.resetPasswordExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
};


const logout = async (req, res) => {
  await realForm.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
  });

  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
 
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const delelteUser = await realForm.findByIdAndDelete(id);
  if (!delelteUser) {
    return res.status(404).json({ message: "user not deleted" });
  }
  return res.status(200).json({ message: "user is deleted" }, delelteUser);
};
export { auth, verifyEmail, resetPassword, logout, deleteUser, UserData };
 