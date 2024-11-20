import jwt from "jsonwebtoken";
const generateToken = (userPayload) => {
  const token = jwt.sign(userPayload, process.env.JWT_VERIFY_SECRET, {
    expiresIn: "5m",
  });
  return token;
};

// generateAccessToken
const generateAccessToken = (userPayload) => {
  const token = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export { generateToken, generateAccessToken };
