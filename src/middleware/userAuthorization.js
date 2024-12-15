import jwt from "jsonwebtoken";

const roleCheck = (req, res, next) => {
    if (!req.header("Authorization")) {
        return res
            .status(401)
            .json({ success: false, message: "Access denied!" });
    }
    const token = req.header("Authorization").split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "ADMIN") {
            return res
                .status(403)
                .json({ success: false, message: "Access denied!" });
        }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default roleCheck;
