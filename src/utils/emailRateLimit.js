import rateLimit from "express-rate-limit";

export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,                 // 5 requests
  message: {
    message: "Too many email requests. Try again later.",
  },
});
