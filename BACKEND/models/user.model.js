import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "recruiter"],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, //url to resume file
        resumeOriginalName: { type: String },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        profilePhoto: {
            type: String,
            default: ""
        },
        college: { type: String, default: "" },
        degree: { type: String, default: "" },
        graduationYear: { type: String, default: "" },
        cgpa: { type: String, default: "" },
        headline: { type: String, default: "" },
        location: { type: String, default: "" },
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        resumeUploadDate: { type: String, default: "" }
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }
    ]
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);