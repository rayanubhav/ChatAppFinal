import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // --- THIS IS THE FIX ---
  // We define the cookie options
  const cookieOptions = {
    httpOnly: true, // Prevents XSS attacks
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // Default for safety
  };

  // IF in production (deployed), we MUST add SameSite=None and Secure=true
  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "none";
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions); // Set cookie with the options
};

export default createTokenAndSaveCookie;