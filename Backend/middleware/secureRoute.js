import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const secureRoute = (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified?.userId || !mongoose.Types.ObjectId.isValid(verified.userId)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach decoded user directly without DB round-trip
    req.user = { _id: verified.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized or token expired" });
  }
};

export default secureRoute;