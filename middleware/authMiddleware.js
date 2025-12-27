const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";


module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ message: "No token provided" });

  // لازم تكون "Bearer TOKEN"
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(403).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
