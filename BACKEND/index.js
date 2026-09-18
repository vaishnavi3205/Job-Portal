import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const app = express();

// CORS configuration with environment flexibility
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation"));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploads with headers optimized for in-browser PDF viewing
app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    if (req.path.toLowerCase().endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
    }
    next();
}, express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 8000;

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err?.message || err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        success: false
    });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
