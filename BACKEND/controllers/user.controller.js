import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const file = req.file;
        let profilePhoto = "";
        if (file) {
            const cloudUrl = await uploadToCloudinary(file.path, "avatars");
            profilePhoto = cloudUrl || `${req.protocol}://${req.get("host")}/uploads/avatars/${file.filename}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: profilePhoto || "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            savedJobs: user.savedJobs || []
        };

        const isProduction = process.env.NODE_ENV === "production";
        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        return res.status(200).cookie("token", "", { 
            maxAge: 0, 
            httpOnly: true, 
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("savedJobs");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { 
            fullname, 
            email, 
            phoneNumber, 
            bio, 
            skills, 
            college, 
            degree, 
            graduationYear, 
            cgpa, 
            headline, 
            location, 
            github, 
            linkedin, 
            portfolio 
        } = req.body;
        
        const file = req.file;

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Check for duplicate email if updating email
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already in use by another account.",
                    success: false
                });
            }
            user.email = email;
        }

        // updating data
        if (fullname) user.fullname = fullname;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;
        if (college !== undefined) user.profile.college = college;
        if (degree !== undefined) user.profile.degree = degree;
        if (graduationYear !== undefined) user.profile.graduationYear = graduationYear;
        if (cgpa !== undefined) user.profile.cgpa = cgpa;
        if (headline !== undefined) user.profile.headline = headline;
        if (location !== undefined) user.profile.location = location;
        if (github !== undefined) user.profile.github = github;
        if (linkedin !== undefined) user.profile.linkedin = linkedin;
        if (portfolio !== undefined) user.profile.portfolio = portfolio;

        if (skills) {
            const skillsArray = Array.isArray(skills)
                ? skills.map(s => s.trim()).filter(Boolean)
                : skills.split(",").map(s => s.trim()).filter(Boolean);
            user.profile.skills = skillsArray;
        }
      
        // handle resume or profile photo
        if (file) {
            const isImage = file.mimetype && file.mimetype.startsWith("image/");
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            if (isImage) {
                const cloudUrl = await uploadToCloudinary(file.path, "avatars");
                user.profile.profilePhoto = cloudUrl || `${baseUrl}/uploads/avatars/${file.filename}`;
            } else {
                const cloudUrl = await uploadToCloudinary(file.path, "resumes");
                user.profile.resume = cloudUrl || `${baseUrl}/uploads/resumes/${file.filename}`;
                user.profile.resumeOriginalName = file.originalname;
                user.profile.resumeUploadDate = new Date().toISOString().split("T")[0];
            }
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            savedJobs: user.savedJobs || []
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// TOGGLE SAVE JOB (Bookmark)
export const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (!user.savedJobs) {
            user.savedJobs = [];
        }

        const isSaved = user.savedJobs.some(id => id.toString() === jobId);
        if (isSaved) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();

        return res.status(200).json({
            message: isSaved ? "Job removed from saved bookmarks" : "Job saved to bookmarks successfully",
            savedJobs: user.savedJobs,
            isSaved: !isSaved,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// GET ALL SAVED JOBS FOR LOGGED-IN CANDIDATE
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: "savedJobs",
            populate: { path: "company" }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            savedJobs: user.savedJobs || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};