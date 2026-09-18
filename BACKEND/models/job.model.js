import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type:Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type:Number,
        required:true
    },
    company: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required: true
    },
    created_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ],
    responsibilities: [{
        type: String
    }],
    perks: [{
        type: String
    }],
    eligibility: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "closed", "draft"],
        default: "active"
    },
    deadline: {
        type: Date
    }
},{timestamps:true});

jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ salary: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ created_by: 1 });

export const Job = mongoose.model("Job", jobSchema);