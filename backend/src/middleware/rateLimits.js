import { rateLimit } from "express-rate-limit";

const options = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
};

export const loginLimiter = rateLimit({
  ...options,
  limit: 15,
  skipSuccessfulRequests: true,
});
export const accountLimiter = rateLimit({ ...options, limit: 5 });
