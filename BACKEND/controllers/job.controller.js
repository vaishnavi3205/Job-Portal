import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

const escapeRegex = (text) => {
    if (!text || typeof text !== "string") return "";
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Admin creates job
export const postJob = async (req, res) => {
    try {
        const {
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experience, 
            position, 
            companyId,
            perks,
            eligibility,
            responsibilities,
            status,
            deadline
        } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || salary === undefined || salary === null || !location || !jobType || experience === undefined || experience === null || experience === "" || position === undefined || position === null || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const parsedSalary = Number(salary);
        const parsedExperience = Number(experience);
        const parsedPosition = Number(position);

        if (isNaN(parsedSalary) || isNaN(parsedExperience) || isNaN(parsedPosition)) {
            return res.status(400).json({
                message: "Salary, Experience, and Position must be valid numbers",
                success: false
            });
        }

        const requirementsArray = Array.isArray(requirements)
            ? requirements
            : requirements.split(",").map(r => r.trim()).filter(Boolean);

        const perksArray = Array.isArray(perks)
            ? perks
            : (typeof perks === "string" ? perks.split(",").map(p => p.trim()).filter(Boolean) : []);

        const responsibilitiesArray = Array.isArray(responsibilities)
            ? responsibilities
            : (typeof responsibilities === "string" ? responsibilities.split(",").map(r => r.trim()).filter(Boolean) : []);

        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirementsArray,
            salary: parsedSalary,
            location: location.trim(),
            jobType: jobType.trim(),
            experience: parsedExperience,
            position: parsedPosition,
            company: companyId,
            created_by: userId,
            perks: perksArray,
            responsibilities: responsibilitiesArray,
            eligibility: eligibility || "",
            status: status || "active",
            deadline: deadline ? new Date(deadline) : null
        });
        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Search & filter jobs with optional pagination
export const getAllJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            jobType,
            minSalary,
            maxSalary,
            status,
            page,
            limit
        } = req.query;

        const query = {};

        // Default to active jobs for candidate searches unless specified
        if (status) {
            query.status = status;
        }

        if (keyword) {
            const trimmed = keyword.trim();
            const escaped = escapeRegex(trimmed);

            // Flexible pattern allowing spaces/dashes/dots between characters
            // e.g., "fullstack" matches "Full Stack", "full-stack", etc.
            const cleanChars = trimmed.replace(/[^a-zA-Z0-9]/g, "").split("");
            const flexiblePattern = cleanChars.length > 0 
                ? cleanChars.map(c => escapeRegex(c)).join("[\\s\\-_.]*") 
                : escaped;

            query.$or = [
                { title: { $regex: flexiblePattern, $options: "i" } },
                { description: { $regex: flexiblePattern, $options: "i" } },
                { location: { $regex: flexiblePattern, $options: "i" } },
                { requirements: { $regex: flexiblePattern, $options: "i" } },
                { title: { $regex: escaped, $options: "i" } },
                { description: { $regex: escaped, $options: "i" } }
            ];
        }

        if (location) {
            const trimmedLoc = location.trim();
            const locChars = trimmedLoc.replace(/[^a-zA-Z0-9]/g, "").split("");
            const locPattern = locChars.length > 0 
                ? locChars.map(c => escapeRegex(c)).join("[\\s\\-_.]*") 
                : escapeRegex(trimmedLoc);
            query.location = { $regex: locPattern, $options: "i" };
        }

        if (jobType) {
            const trimmedType = jobType.trim();
            const typeChars = trimmedType.replace(/[^a-zA-Z0-9]/g, "").split("");
            const typePattern = typeChars.length > 0 
                ? typeChars.map(c => escapeRegex(c)).join("[\\s\\-_.]*") 
                : escapeRegex(trimmedType);
            query.jobType = { $regex: typePattern, $options: "i" };
        }

        if (minSalary !== undefined || maxSalary !== undefined) {
            query.salary = {};
            if (minSalary !== undefined) query.salary.$gte = Number(minSalary);
            if (maxSalary !== undefined) query.salary.$lte = Number(maxSalary);
        }

        const totalJobs = await Job.countDocuments(query);

        let jobsQuery = Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        if (page && limit) {
            const pageNum = Math.max(1, parseInt(page, 10));
            const limitNum = Math.max(1, parseInt(limit, 10));
            jobsQuery = jobsQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
            const jobs = await jobsQuery;
            return res.status(200).json({
                jobs: jobs || [],
                totalJobs,
                totalPages: Math.ceil(totalJobs / limitNum),
                currentPage: pageNum,
                success: true
            });
        }

        const jobs = await jobsQuery;
        return res.status(200).json({
            jobs: jobs || [],
            totalJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// GET JOB BY ID (Public safe endpoint - NO applicant personal information leaked)
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: "company" });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Return sanitized job with totalApplications count
        const jobData = job.toObject();
        jobData.totalApplications = Array.isArray(job.applications) ? job.applications.length : 0;

        return res.status(200).json({ job: jobData, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Recruiter jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: "company" })
            .sort({ createdAt: -1 });
        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// DELETE JOB by admin (with cascading deletion of orphan applications)
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this job",
                success: false
            });
        }

        // Clean up all applications submitted to this job
        await Application.deleteMany({ job: jobId });
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job and associated applications deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// UPDATE JOB by admin
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experience, 
            position, 
            companyId, 
            perks, 
            eligibility, 
            responsibilities,
            status,
            deadline 
        } = req.body;
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to update this job",
                success: false
            });
        }

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (location) updateData.location = location.trim();
        if (jobType) updateData.jobType = jobType.trim();
        if (companyId) updateData.company = companyId;
        if (eligibility !== undefined) updateData.eligibility = eligibility;
        if (status) updateData.status = status;
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
        if (salary !== undefined) updateData.salary = Number(salary);
        if (experience !== undefined) updateData.experience = Number(experience);
        if (position !== undefined) updateData.position = Number(position);

        if (requirements) {
            updateData.requirements = Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(r => r.trim()).filter(Boolean);
        }
        if (perks) {
            updateData.perks = Array.isArray(perks)
                ? perks
                : (typeof perks === "string" ? perks.split(",").map(p => p.trim()).filter(Boolean) : []);
        }
        if (responsibilities) {
            updateData.responsibilities = Array.isArray(responsibilities)
                ? responsibilities
                : (typeof responsibilities === "string" ? responsibilities.split(",").map(r => r.trim()).filter(Boolean) : []);
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { returnDocument: 'after' }).populate("company");
        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// TOGGLE JOB STATUS (active <-> closed)
export const toggleJobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({ message: "Not authorized", success: false });
        }

        job.status = job.status === "active" ? "closed" : "active";
        await job.save();

        return res.status(200).json({
            message: `Job status changed to ${job.status}`,
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
