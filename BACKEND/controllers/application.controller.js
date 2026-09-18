import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId) {
            return res.status(400).json({
                message:"Job id is required",
                success:false
            });
        }

        if (req.role === "recruiter") {
            return res.status(400).json({
                message: "Recruiter accounts cannot apply for jobs",
                success: false
            });
        }

        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});
        if(existingApplication) {
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false
            });
        }

        // check the job exists or not
        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({
                message:"Job not found",
                success:false
            });
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(200).json({
            message:"Application submitted successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }
        return res.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
}

// get all the job applications
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}},
            }
        });
        return res.status(200).json({
            applications: applications || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// admin checks how  many user applied 
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
            }
        });
        if(!job) {
            return res.status(404).json({
                message:"Job not found",
                success:false
            });
        };
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to view applicants for this job",
                success: false
            });
        }
        return res.status(200).json({
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// selected or rejected
export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message:"status is required",
                success:false
            });
        };

        const normalizedStatus = status.toLowerCase();
        if (!["pending", "accepted", "rejected", "shortlisted"].includes(normalizedStatus)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: pending, accepted, rejected, shortlisted",
                success: false
            });
        }

        // find the application by application id
        const application = await Application.findOne({_id:applicationId}).populate("job");
        if(!application) {
            return res.status(404).json({
                message:"Application not found",
                success:false
            });
        };

        if (application.job?.created_by?.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to update this application status",
                success: false
            });
        }

        // update the status
        application.status = normalizedStatus;
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Student withdraws their application
export const withdrawApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        if (application.applicant.toString() !== userId) {
            return res.status(403).json({
                message: "You can only withdraw your own applications",
                success: false
            });
        }

        // Pull application from Job applications array
        await Job.findByIdAndUpdate(application.job, {
            $pull: { applications: application._id }
        });

        await Application.findByIdAndDelete(applicationId);

        return res.status(200).json({
            message: "Application withdrawn successfully",
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