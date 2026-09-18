import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        req.id = decode.userId;
        req.role = decode.role;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}

export const isRecruiter = async (req, res, next) => {
    try {
        if (!req.role || req.role !== "recruiter") {
            return res.status(403).json({
                message: "Access denied. Recruiter role required.",
                success: false
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export default isAuthenticated;
