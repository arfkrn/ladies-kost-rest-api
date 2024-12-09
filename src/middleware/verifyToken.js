import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ errors: "Access denied!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ errors: "Invalid token" });
  }
};

export default verifyToken;
