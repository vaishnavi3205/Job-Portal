import multer from "multer";
import path from "path";
import fs from "fs";

// Storage directory setup
const uploadsDir = path.resolve("uploads");
const resumesDir = path.join(uploadsDir, "resumes");
const avatarsDir = path.join(uploadsDir, "avatars");
const companiesDir = path.join(uploadsDir, "companies");

// Ensure upload folders exist
[uploadsDir, resumesDir, avatarsDir, companiesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = file.mimetype && file.mimetype.startsWith("image/");
        const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");

        if (req.baseUrl?.includes("/company") || req.originalUrl?.includes("/company")) {
            cb(null, companiesDir);
        } else if (isPdf || file.fieldname === "resume" || (!isImage && (req.baseUrl?.includes("/user") || req.originalUrl?.includes("/user")))) {
            cb(null, resumesDir);
        } else {
            cb(null, avatarsDir);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

export const singleUpload = upload.single("file");