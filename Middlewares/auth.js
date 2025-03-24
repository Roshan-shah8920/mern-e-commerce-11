    import jwt from "jsonwebtoken";
    import { User } from "../Models/User.js";


    export const Authenticated = async (req, res, next) => {
        const token = req.header("Auth");  
        console.log("🔹 Received Token:", token); // Debugging token

        if (!token) {
            return res.status(401).json({ message: "Login first, Token missing!" });
        }

        try {
            const decoded = jwt.verify(token, "!@#$%^&*()");
            console.log("🔹 Decoded Token:", decoded);

            let user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: "User does not exist!" });
            }

            req.user = user;
            console.log("✅ User Authenticated:", user); // Debugging user
            next();
        } catch (error) {
            console.error("❌ Auth Error:", error.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    };
