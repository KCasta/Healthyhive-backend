import User from "../models/model.js";
import jwt from "jsonwebtoken";

const ensureIsAutenticated = async (req, res, next) => {
  let token = null;
  // get token from the header
  const authHeader = req.headers["authorization"];
  // check if token exists
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // if no token found, send error message
  if (!token) {
    return res.status(401).json({ message: "auth token is required" });
  }
  try {
    // verify the token
    const userPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // check if user exists
    const user = await User.findById(userPayload._id).select("-password");
    // if no user found, send error message
    if (!user) {
      return res
        .status(404)
        .json({ message: "unathourized request: invalied user" });
    }
    // attach user to the request object
    req.user = user;
    console.log("I am here");
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export { ensureIsAutenticated };
