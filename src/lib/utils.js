import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // Changed from "strict" to "lax" for cross-domain requests
    secure: true, // Always use secure in production
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // Allow cookies on subdomains
  });

  return token;
};
