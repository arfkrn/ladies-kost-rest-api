import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    if (!req.header("Authorization")) {
        return res.status(401).json({ errors: "Access denied!" });
    }
    const token = req.header("Authorization").split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ errors: "Invalid token" });
    }
};

export default verifyToken;
