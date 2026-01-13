import nodemailer from "nodemailer";
// import cron from "node-cron";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;


// cron job  coming soon for email automation 

// cron.schedule("0 9 * * *", async () => {
//   try {
//     await transporter.sendMail({
//       from: "yourmail@gmail.com",
//       to: "client@email.com",
//       subject: "Good Morning ",
//       text: "This is an automated daily email",
//     });

//     console.log(" Email sent at 9 AM");
//   } catch (error) {
//     console.error(" Email error:", error);
//   }
// });

// ┌─ min (0)
// │ ┌─ hour (9)
// │ │ ┌─ day
// │ │ │ ┌─ month
// │ │ │ │ ┌─ week
// 0  9  *  *  *

// 30 * 24 * 60 * 60 * 1000
// 30	days
// 24	hours
// 60	minutes
// 60	seconds
// 1000	milliseconds (JS time ms me hota hai)

// pdfkit wen can build our first pdf 