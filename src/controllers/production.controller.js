import expres from "express";
import realForm from "../model/production.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../utils/nodemailer.js";

const auth = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({ message: " all fields reuired" });
  }

  const user = await realForm.findOne({ email });

  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires = Date.now() + 3600000; // 1 hour ke bad 

    user = await realForm.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&id=${user._id}`;

      const mailOptions = await transporter.sendMail({
          from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>
               <p>Note: Link expires in 1 hour.</p>`,
      })

      return res.status(201).json({
        message: "Registration successful. Check your email to verify.",mailOptions
      });
  }

   //  Login if user exists

  if(!user.isisVerified){
     return res.status(400).json({ message: "Email not verified" });
  }

     const isMatch = await bcrypt.compare(password, user.password);

     if(isMatch){
        const accessToken = jwt.sign({user_id:user._id,user_eamil:user.email},process.env.ACCESSTOKEN, {expiresIn:"15m"})

        const refreshToken = jwt.sign(
        { user_id: user._id },
        process.env.REFRESHTOKEN,
        { expiresIn: "7d" }
      );

      user.refreshToken = refreshToken
      await user.save()

      return res .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken" , refreshToken,{httpOnly: true })
      .json({ message: "Login successful", refreshToken ,user });
     }

    //  Forgot password if password wrong
    
};
