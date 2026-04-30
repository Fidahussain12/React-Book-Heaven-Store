const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, "bookStore123");
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = { authenticateToken };